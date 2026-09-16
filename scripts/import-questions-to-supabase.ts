import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PHYSICS_NLM_LEVEL3_QUESTIONS } from '../src/data/physicsNlmLevel3';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bwdsdxppepngoenpoczz.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('--- Starting JEEVault Supabase Question & Storage Import ---');
  console.log('Supabase URL:', SUPABASE_URL);

  // 1. Authenticate as admin
  const adminEmail = 'test_import_1789582273066@jeevault.internal';
  const adminPw = 'Password123!Secure';
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPw,
  });

  if (authError || !authData.session) {
    console.error('Failed to sign in as admin:', authError?.message);
    process.exit(1);
  }
  console.log('✓ Successfully authenticated as Admin (User ID:', authData.user.id, ')');

  // 2. Upload diagrams to Supabase Storage
  console.log('\n--- Uploading Diagrams to Supabase Storage (Bucket: jeevault-pdfs) ---');
  const diagramsDir = path.resolve(process.cwd(), 'public/diagrams');
  const files = fs.readdirSync(diagramsDir).filter((f) => f.endsWith('.svg'));
  console.log(`Found ${files.length} diagram SVG files in public/diagrams`);

  const storageUrlMap: Record<string, string> = {};

  for (const file of files) {
    const filePath = path.join(diagramsDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    // Determine storage subfolder
    const isSolution = file.startsWith('nlm-sol-');
    const folder = isSolution ? 'solution-images' : 'question-images';
    const storagePath = `${folder}/${file}`;

    const { error: uploadErr } = await supabase.storage
      .from('jeevault-pdfs')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/svg+xml',
        upsert: true,
      });

    if (uploadErr) {
      console.warn(`Note for ${file}:`, uploadErr.message);
    }
    const { data: pubUrlData } = supabase.storage
      .from('jeevault-pdfs')
      .getPublicUrl(storagePath);
    const publicUrl = pubUrlData.publicUrl;
    storageUrlMap[`/diagrams/${file}`] = publicUrl;
    storageUrlMap[file] = publicUrl;
    console.log(`✓ Diagram mapped ${file} -> ${publicUrl}`);
  }

  // 3. Inspect existing questions in Supabase
  console.log('\n--- Checking Existing Questions in Supabase ---');
  const { data: existingRows, error: fetchErr } = await supabase
    .from('questions')
    .select('*')
    .eq('subject', 'Physics')
    .eq('chapter', "Newton's Laws of Motion and Friction");

  if (fetchErr) {
    console.error('Error querying questions:', fetchErr.message);
  }

  const existingMap = new Map<number, any>();
  if (existingRows) {
    for (const row of existingRows) {
      existingMap.set(row.question_number, row);
    }
  }
  console.log(`Found ${existingMap.size} existing questions for Newton's Laws of Motion and Friction`);

  // 4. Insert or Update all 37 questions
  console.log('\n--- Inserting 37 Level 3 Questions into Supabase Database ---');
  let insertedCount = 0;
  let updatedCount = 0;

  for (const q of PHYSICS_NLM_LEVEL3_QUESTIONS) {
    const qNum = q.questionNumber;

    // Map question images to Supabase storage URLs
    const qImages = (q.questionImages || []).map((img) => storageUrlMap[img] || img);
    const solImages = (q.solutionImages || []).map((img) => storageUrlMap[img] || img);

    // Prepare embedded metadata for resilience across all Supabase column configurations
    let questionText = q.questionText;
    for (const qImg of qImages) {
      if (!questionText.includes(qImg)) {
        questionText += `\n\n[image: ${qImg}]`;
      }
    }

    let solutionText = q.solutionText;
    for (const sImg of solImages) {
      if (!solutionText.includes(sImg)) {
        solutionText += `\n\n[solution_image: ${sImg}]`;
      }
    }

    const metaObj = {
      type: q.questionType || 'Single Correct',
      indices: q.correctOptionIndices || (q.questionType === 'Multiple Correct' ? [q.correctOptionIndex] : []),
      integerAnswer: q.correctIntegerAnswer ?? null,
      paragraphText: q.paragraphText || null,
      qImages,
      solImages,
    };

    const keyFormula = `${q.keyFormula || ''}\n[meta: ${JSON.stringify(metaObj)}]`;

    const rowPayload: Record<string, any> = {
      subject: 'Physics',
      exam_category: 'JEE Advanced',
      chapter: "Newton's Laws of Motion and Friction",
      level: 'Level 3',
      question_number: qNum,
      difficulty: 'Advanced',
      question_text: questionText,
      options: q.options || [],
      correct_option_index: q.correctOptionIndex ?? 0,
      solution_text: solutionText,
      key_formula: keyFormula,
      created_by: authData.user.id,
    };

    const existing = existingMap.get(qNum);
    if (existing) {
      const { error: updateErr } = await supabase
        .from('questions')
        .update(rowPayload)
        .eq('id', existing.id);
      if (updateErr) {
        console.error(`Error updating Q${qNum}:`, updateErr.message);
      } else {
        updatedCount++;
      }
    } else {
      const { error: insertErr } = await supabase
        .from('questions')
        .insert(rowPayload);
      if (insertErr) {
        console.error(`Error inserting Q${qNum}:`, insertErr.message);
      } else {
        insertedCount++;
      }
    }
  }

  console.log(`\n✓ Insert/Update Complete: ${insertedCount} inserted, ${updatedCount} updated.`);

  // 5. Public read verification (without authentication token, as a student would do)
  console.log('\n--- Verifying Public Read of Questions from Supabase ---');
  const unauthedSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: publicData, error: pubErr } = await unauthedSupabase
    .from('questions')
    .select('*')
    .eq('subject', 'Physics')
    .eq('chapter', "Newton's Laws of Motion and Friction")
    .order('question_number', { ascending: true });

  if (pubErr) {
    console.error('Error fetching questions publicly:', pubErr.message);
    process.exit(1);
  }

  console.log(`✓ Verification Success: Total questions returned by Supabase = ${publicData?.length}`);
  if (publicData && publicData.length > 0) {
    const firstQ = publicData[0];
    console.log('Sample Q1 retrieved from Supabase:');
    console.log('  ID:', firstQ.id);
    console.log('  Subject:', firstQ.subject);
    console.log('  Chapter:', firstQ.chapter);
    console.log('  Level:', firstQ.level);
    console.log('  Question #:', firstQ.question_number);
    console.log('  Has [image: ...] in text:', firstQ.question_text.includes('[image: '));
    console.log('  Has [solution_image: ...] in solution:', firstQ.solution_text.includes('[solution_image: '));
    console.log('  Has [meta: ...] in formula:', firstQ.key_formula.includes('[meta: '));
  }
}

main().catch((err) => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
