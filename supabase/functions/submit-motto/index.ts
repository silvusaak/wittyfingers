import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // max submissions per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Offensive words filter (lowercase)
const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick', 'cock', 'pussy',
  'nigger', 'faggot', 'retard', 'slut', 'whore', 'bastard', 'asshole',
  'motherfucker', 'bullshit', 'piss', 'crap'
];

// Spam patterns (regex)
const SPAM_PATTERNS = [
  /https?:\/\/[^\s]+/gi,           // URLs
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
  /(.)\1{4,}/g,                     // Repeated characters (5+)
  /buy now|click here|free money|earn \$|bitcoin|crypto|viagra|casino/gi, // Common spam phrases
  /\d{10,}/g,                       // Phone numbers (10+ digits)
];

function containsOffensiveContent(text: string): { blocked: boolean; reason?: string } {
  const lowerText = text.toLowerCase();
  
  // Check for blocked words
  for (const word of BLOCKED_WORDS) {
    // Match whole words only
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      return { blocked: true, reason: 'Contains inappropriate language' };
    }
  }
  
  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { blocked: true, reason: 'Contains spam content' };
    }
  }
  
  return { blocked: false };
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    console.log(`Submission attempt from IP: ${clientIP}`);

    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.log(`Rate limited IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { nickname, motto_text, timezone, captcha_num1, captcha_num2, captcha_answer, website } = await req.json();

    // Honeypot check - if 'website' field is filled, it's a bot
    if (website && website.trim().length > 0) {
      console.log(`Honeypot triggered from IP: ${clientIP}`);
      // Silently "succeed" to fool the bot
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!motto_text || typeof motto_text !== 'string' || motto_text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Motto text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (motto_text.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'Motto must be less than 10,000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for offensive content in motto and nickname
    const mottoCheck = containsOffensiveContent(motto_text);
    if (mottoCheck.blocked) {
      console.log(`Content blocked from IP ${clientIP}: ${mottoCheck.reason}`);
      return new Response(
        JSON.stringify({ error: mottoCheck.reason }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (nickname) {
      const nicknameCheck = containsOffensiveContent(nickname);
      if (nicknameCheck.blocked) {
        console.log(`Nickname blocked from IP ${clientIP}: ${nicknameCheck.reason}`);
        return new Response(
          JSON.stringify({ error: 'Nickname ' + nicknameCheck.reason?.toLowerCase() }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate captcha server-side
    if (typeof captcha_num1 !== 'number' || typeof captcha_num2 !== 'number' || typeof captcha_answer !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid captcha data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the numbers are reasonable (1-10 range)
    if (captcha_num1 < 1 || captcha_num1 > 10 || captcha_num2 < 1 || captcha_num2 > 10) {
      return new Response(
        JSON.stringify({ error: 'Invalid captcha question' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the answer
    if (captcha_num1 + captcha_num2 !== captcha_answer) {
      console.log(`Captcha failed: ${captcha_num1} + ${captcha_num2} != ${captcha_answer}`);
      return new Response(
        JSON.stringify({ error: 'Incorrect captcha answer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert the motto
    const { data, error } = await supabase.from('mottos').insert({
      nickname: nickname?.trim() || 'anonymous',
      motto_text: motto_text.trim(),
      timezone: timezone || null,
    }).select().single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit motto' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Motto submitted successfully: #${data.number}`);

    return new Response(
      JSON.stringify({ success: true, motto: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-motto function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
