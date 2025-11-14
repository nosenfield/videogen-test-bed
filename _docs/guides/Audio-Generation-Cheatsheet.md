# AI Audio Generation - Prompt Syntax & Variable Cheatsheet

## AVAILABLE SERVICES & MODELS

### **Suno AI** (Most Popular)
- **Models:** V5, V4.5+, V4.5, V4, V3.5
- **V5** (Latest - Nov 2025): Studio-quality mixing, improved vocals, better structural coherence, max 8 min
- **V4.5+**: Richer sound, new creation methods, max 8 min, highest fidelity
- **V4.5**: Superior genre blending, smarter prompts, faster output, max 8 min
- **V4**: Best audio quality, refined structure, max 4 min
- **V3.5**: Solid arrangements, creative diversity, max 4 min
- **Generation Time:** 30-90 seconds
- **Lyrics Support:** Yes, with structure tags
- **Cost:** ~$0.15-0.30 per generation (varies by provider)

### **Udio AI**
- **Models:** V1.5 Allegro, V1.5, V1.0
- **V1.5 Allegro**: Studio-quality, highest fidelity, songs up to 2:10 min
- **V1.5**: Improved audio quality, faster generation, better style adherence
- **Generation Time:** 1-3 minutes
- **Lyrics Support:** Yes

### **Google Lyria (Realtime)**
- **Model:** lyria-realtime-exp
- **Real-time streaming:** Yes
- **BPM Range:** 60-200
- **Instrumental Only:** Yes (no vocals)
- **Fine-grained Control:** Highest (real-time parameter adjustment)

### **Riffusion**
- **Specialization:** Electronic music, instrumentals
- **Real-time editing:** Limited

---

## CORE PROMPT ELEMENTS

### **1. Genre/Style** (Primary)
The musical category that defines the overall sound and structure.

**Examples:**
- Pop, Rock, Hip-Hop, Jazz, Classical, Electronic, Country, Metal
- Subgenres: Lo-fi Hip-Hop, Synthwave, Progressive Rock, Tropical House
- Fusion: Country-Trap, Classical Electronica, Jazz-Funk

**Advanced Genre Descriptors:**
- Chillwave electronic
- Futuristic cyberpunk EDM
- Vintage jazz lounge
- Baroque pop
- Dark ambient
- Psychedelic funk
- Math rock
- Gregorian chant

---

### **2. Mood/Emotion** (Critical)
The feeling or atmosphere the music should evoke.

| Mood | Description |
|------|-------------|
| **Tense** | Suspense, unease, anticipation |
| **Dreamlike** | Soft, surreal, floaty, hazy |
| **Frenetic** | Fast-paced, chaotic, energetic |
| **Whimsical** | Light-hearted, quirky, playful |
| **Bleak** | Emotionally heavy, grim |
| **Euphoric** | Intense joy, emotional high |
| **Dreadful** | Underlying fear, doom-laden |
| **Serene** | Calm, peaceful, soft |
| **Gritty** | Raw, harsh realism |
| **Romantic** | Warm, emotional, nostalgic |
| **Melancholic** | Sad, reflective, slow |
| **Triumphant** | Victorious, uplifting |
| **Isolated** | Lonely, detached |
| **Hypnotic** | Mesmerizing pacing/visuals |
| **Energetic** | High tempo, vibrant |
| **Mysterious** | Unclear intent, hidden elements |
| **Cold** | Emotionally distant, blue-toned |

---

### **3. Tempo/BPM**
The speed and rhythmic feel of the music.

**Tempo Descriptors:**
- Very Slow: 40-60 BPM (Largo, Ballad)
- Slow: 60-80 BPM (Adagio, Downtempo)
- Moderate: 80-120 BPM (Andante, Mid-tempo)
- Fast: 120-140 BPM (Allegro, Upbeat)
- Very Fast: 140-200 BPM (Presto, Uptempo)

**Rhythmic Feel:**
- Driving beat
- Syncopated rhythm
- Gentle waltz (3/4 time)
- Swing feel
- Straight feel
- Shuffle groove
- Tipsy, groovy
- Mid-tempo syncopated

**Google Lyria Specific:**
- BPM Range: 60-200 (required for real-time generation)
- Density: 0.0-1.0 (controls note density)
- Brightness: 0.0-1.0 (tonal quality, higher = brighter)

---

### **4. Instrumentation**
Key instruments that shape the sonic palette.

**Common Instruments:**

**Strings:**
- Acoustic Guitar, Electric Guitar, Bass Guitar
- Violin, Cello, Viola, Upright Bass
- Harp, Mandolin, Banjo

**Keys:**
- Piano, Electric Piano, Rhodes
- Synthesizer, Organ, Harpsichord
- Accordion

**Winds:**
- Saxophone, Trumpet, Trombone
- Flute, Clarinet, Oboe
- Harmonica

**Percussion:**
- Drums (acoustic/electronic)
- Percussion, Hand Drums
- Cymbals, Timpani

**Electronic:**
- Synthesizer, Synth Pads
- 808 Bass, Sub-bass
- Arpeggiator
- Vocoder

**Examples in Prompts:**
- "Smooth saxophone lead with gentle piano accompaniment"
- "Distorted electric guitar with heavy drums"
- "Orchestral strings with powerful brass"
- "Vintage Rhodes piano with muted trumpet"
- "Sub-bass with glitchy electronic drums"

---

### **5. Vocal Characteristics**
(If vocals are included)

**Vocal Gender:**
- Male vocals
- Female vocals
- Gender-neutral vocals

**Vocal Style:**
- Smooth, Raspy, Breathy, Powerful
- Whispered, Spoken-word
- Rap delivery, Melodic rap
- Operatic, Broadway
- Harmonic, Layered
- Auto-tuned

**Suno-Specific Vocal Parameters:**
- `vocal_gender`: "m" (Male) or "f" (Female)
- Supported in: chirp-v4-5, chirp-v4-5-plus, chirp-v5

---

### **6. Production Style**
The mixing, mastering, and production aesthetic.

| Style | Description |
|-------|-------------|
| **Lo-fi** | Warm, vinyl crackle, tape hiss, nostalgic |
| **Hi-fi** | Crisp, clean, modern production |
| **Raw** | Unpolished, garage-band feel |
| **Polished** | Studio-quality, professional mix |
| **Compressed** | Radio-ready, loud, punchy |
| **Spacious** | Reverb-heavy, atmospheric |
| **Dry** | Minimal reverb, intimate |
| **Distorted** | Overdriven, gritty, aggressive |
| **Clean** | Pristine, no artifacts |
| **Vintage** | Old-school, analog warmth |
| **Modern** | Contemporary, digital |

---

### **7. Song Structure Tags**
(For services like Suno that support structured generation)

**Meta Tags:**
- `[Intro]` - Opening section
- `[Verse]` or `[Verse 1]` - Story/narrative section
- `[Pre-Chorus]` - Build-up before chorus
- `[Chorus]` - Main hook/refrain
- `[Bridge]` - Contrasting section
- `[Outro]` - Ending section
- `[Instrumental]` - No vocals
- `[Break]` - Musical pause or breakdown
- `[Solo]` - Instrument solo section
- `[Drop]` - EDM-style bass drop

**Usage Example:**
```
[Intro]
Ambient synth pad with distant vocals...

[Verse 1]
Walking down the empty street
City lights reflecting in the rain

[Chorus]
This is where we come alive
Under neon skies tonight
```

---

## ADVANCED PARAMETERS

### **Suno API Parameters**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `custom_mode` | boolean | Enable custom lyrics/structure | false |
| `make_instrumental` | boolean | Generate without vocals | false |
| `prompt` | string | Lyrics (custom mode) or description (simple mode) | required |
| `tags` | string | Genre/style/mood descriptors | required |
| `title` | string | Song title (max 80 chars) | optional |
| `mv` | string | Model version (chirp-v3-5, chirp-v4, chirp-v5, etc.) | chirp-v3-5 |
| `style_weight` | float | Weight of style tags (0.0-1.0) | 0.5 |
| `weirdness_constraint` | float | Creative deviation (0.0-1.0) | 0.5 |
| `negative_tags` | string | Styles/instruments to avoid | optional |
| `vocal_gender` | string | "m" or "f" for vocal gender | optional |
| `audio_weight` | float | Audio consistency weight (0.0-1.0) | 0.5 |

### **Google Lyria Parameters**

| Parameter | Range | Description | Default |
|-----------|-------|-------------|---------|
| `bpm` | 60-200 | Beats per minute | Auto |
| `temperature` | 0.0-3.0 | Randomness/creativity | 1.1 |
| `guidance` | 0.0-6.0 | Prompt adherence (higher = stricter) | 4.0 |
| `density` | 0.0-1.0 | Note density (lower = sparse) | Auto |
| `brightness` | 0.0-1.0 | Tonal brightness (higher frequencies) | Auto |
| `scale` | enum | Musical scale/key (C_MAJOR_A_MINOR, etc.) | Auto |
| `top_k` | 1-1000 | Sampling diversity | 40 |
| `seed` | 0-2147483647 | Reproducibility seed | Random |

**Scales Available:**
- C_MAJOR_A_MINOR (white keys)
- F_MAJOR_D_MINOR (white keys except B♭)
- G_MAJOR_E_MINOR
- D_MAJOR_B_MINOR
- And more...

---

## PROMPT ENGINEERING BEST PRACTICES

### **Structure Your Prompt**

**Format 1: Descriptive Paragraph**
```
"A melancholic jazz ballad with smooth saxophone, walking bassline, 
and brushed drums. Late-night club atmosphere. Tempo around 75 BPM. 
Nostalgic and intimate mood."
```

**Format 2: Comma-Separated Keywords**
```
"Lo-fi hip-hop, chill vibes, 90 BPM, vinyl crackle, mellow male rap vocals, 
late night city, introspective"
```

**Format 3: Structured with Tags (Suno)**
```
Genre: Dream Pop, Trip-Hop
Mood: Haunting, ethereal
Tempo: 85 BPM, downtempo
Instruments: Rhodes piano, muted trumpets, sub-bass, vinyl crackle
Vocals: Whispered female (Portishead style)

[Intro]
...
```

---

### **DO's:**

1. **Be Specific** - "Jazz ballad with saxophone solo" beats "jazz song"
2. **Layer Details** - Start broad (genre), then add specifics (instruments, mood)
3. **Use Concrete Descriptors** - "Warm analog synth" vs "nice synth"
4. **Specify Tempo** - Include BPM or tempo descriptor
5. **Define Mood Clearly** - Emotional direction guides generation
6. **Mention Key Instruments** - 2-4 main instruments
7. **Reference Era/Style** - "80s synthwave" or "90s grunge"
8. **Iterate** - Refine prompts based on results
9. **Use Negative Tags** - Tell it what NOT to include
10. **Structure Matters** - Use tags for clear song sections

---

### **DON'Ts:**

1. **Don't Be Vague** - "Make a song" is useless
2. **Don't Use Artist Names** - Copyright issues (use style descriptors instead)
3. **Don't Contradict** - "Fast, slow jazz" confuses the model
4. **Don't Expect Perfection First Try** - AI music is iterative
5. **Don't Overcomplicate** - Too many conflicting elements
6. **Don't Skip Mood** - Emotional context is critical
7. **Don't Ignore Genre Conventions** - Jazz rarely has distorted guitars
8. **Don't Forget Tempo** - Impacts the entire feel
9. **Don't Mix Too Many Genres** - 2 max for coherence
10. **Don't Assume Context** - AI doesn't read your mind

---

## EXAMPLE PROMPTS BY USE CASE

### **Music Video - High Energy**
```
Upbeat EDM track, 128 BPM, festival anthem
Big room house, electro house fusion
Massive build-ups, powerful drops
Bright synth leads, sub-bass, energetic drums
Mood: euphoric, triumphant
Perfect for: jump cuts, fast transitions, crowd shots
```

### **Music Video - Emotional Ballad**
```
Melancholic piano ballad, 65 BPM
Intimate female vocals, breathy and emotional
Strings enter in the chorus, orchestral build
Mood: sad, nostalgic, reflective
Cinematic, spacious production
Perfect for: slow motion, close-ups, narrative storytelling
```

### **Ad Creative - Product Showcase**
```
Upbeat corporate pop, 120 BPM
Clean production, bright and optimistic
Acoustic guitar, soft piano, light percussion
Instrumental only
Mood: confident, professional, approachable
Perfect for: product reveals, lifestyle shots
```

### **Ad Creative - Luxury Brand**
```
Minimal ambient electronic, 80 BPM
Ethereal synth pads, subtle piano
Deep sub-bass undertones
No drums, spacious and elegant
Mood: sophisticated, mysterious, premium
Perfect for: slow pans, elegant product shots
```

### **Lo-fi Background Music**
```
Chill lo-fi hip-hop beat, 90 BPM
Warm vinyl crackle, tape hiss
Jazzy piano samples, mellow bass
Soft drums with swing feel
Instrumental only
Mood: relaxed, nostalgic, cozy
```

### **Epic Cinematic Score**
```
Orchestral epic, 90 BPM
Dramatic strings, powerful brass, thundering timpani
Builds from quiet to massive climax
Choir enters in final section
Mood: heroic, triumphant, majestic
Hans Zimmer style, modern cinematic
```

### **Punk Rock Energy**
```
Fast punk rock, 180 BPM
Distorted power chords, driving drums
Raw, aggressive male vocals
Simple chord progression, DIY production
Mood: rebellious, energetic, angry
90s punk aesthetic
```

---

## SERVICE CAPABILITIES COMPARISON

| Feature | Suno | Udio | Google Lyria | Riffusion |
|---------|------|------|--------------|-----------|
| **Vocals** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Custom Lyrics** | ✅ Yes | ✅ Yes | N/A | N/A |
| **Max Length** | 8 min | 2:10 min | Unlimited (stream) | 2 min |
| **Real-time Control** | ❌ No | ❌ No | ✅ Yes | Limited |
| **BPM Control** | Prompt-based | Prompt-based | ✅ Exact (60-200) | Limited |
| **Genre Range** | Excellent | Excellent | Good | Electronic focus |
| **Beat Detection** | Via 3rd party API | Via 3rd party API | Built-in | Via 3rd party |
| **Stem Separation** | Via API | Via API | N/A | N/A |
| **Generation Speed** | 30-90 sec | 1-3 min | Real-time | Fast |
| **Cost** | $$$ | $$$ | $$ | $ |
| **Commercial Use** | Paid plans | Paid plans | Check terms | Check terms |

---

## BEAT DETECTION & ANALYSIS

For your pipeline's beat-based scene segmentation, you'll need a separate service:

### **Music.ai / Moises API**
- **Workflow:** "Extract Beat map and BPM"
- **Output:** JSON with beat timestamps
- **Features:**
  - BPM detection
  - Beat annotations (start time, beat number)
  - Chord transcription
  - Lyrics alignment
  - Stem separation

### **Common Libraries (Self-hosted)**
- **librosa** (Python): Beat detection, tempo estimation
- **essentia** (Python/C++): Advanced music analysis
- **aubio** (Python): Real-time beat tracking

---

## COST OPTIMIZATION STRATEGIES

1. **Start with Cheaper Models**
   - Use V3.5 or V4 for iteration
   - Switch to V5/V4.5+ for finals

2. **Generate in Batches**
   - Most APIs give 2 songs per request
   - Use both for A/B testing

3. **Cache Audio Assets**
   - Store generated tracks
   - Reuse audio across multiple videos

4. **Instrumental First**
   - Instrumentals typically cheaper
   - Add vocals only if needed

5. **Use Beat Detection Once**
   - Analyze audio, store timestamps
   - Reuse for multiple edits

6. **Target Cost:** <$2.00 per minute of final video

---

## YOUR PIPELINE INTEGRATION

Based on your flow, here's how to integrate:

```
1. HIGH-LEVEL CONCEPT
   ↓
2. GENERATE AUDIO TRACK
   - Use Suno API with concept-based prompt
   - Generate instrumental OR with vocals/lyrics
   - Cost: ~$0.20-0.40 per track
   ↓
3. ANALYZE AUDIO FOR BEATS
   - Use Music.ai or librosa
   - Extract: BPM, beat timestamps, measure boundaries
   - Output: JSON with scene timing data
   ↓
4. SCENE SEGMENTATION
   - Map beats to scene transitions
   - Calculate clip lengths based on musical structure
   ↓
5. GENERATE SCENE PROMPTS
   - Use Claude/GPT to expand concept into N scene prompts
   - Include: timing info, visual style, transitions
   ↓
6. VIDEO GENERATION
   [Your existing flow continues...]
```

---

## LYRICS & STRUCTURE EXTRACTION

If user uploads audio, you need lyrics:

**Option A: Use Suno's aligned lyrics API**
- `/api/get_aligned_lyrics`
- Returns: timestamps for each word

**Option B: Use Music.ai**
- Transcribe and align lyrics from audio
- Optimized for singing

**Option C: User provides lyrics**
- Manual input
- Paste into custom mode

---

## FINE-GRAINED CONTROL LIMITATIONS

**What You CAN Control:**
- Genre, style, mood
- Tempo (via prompt or BPM parameter)
- Instrumentation
- Vocal style/gender
- Structure (with tags)
- Production style

**What You CANNOT Control Precisely:**
- Exact note sequences
- Specific chord progressions
- Time signature (limited)
- Exact transition at timestamp X
- Precise measure boundaries
- Key signature (some models)

**Workaround for Precision:**
- Generate multiple variations
- Use "extend" features to develop sections
- Post-process with DAW for exact timing
- Use Google Lyria for real-time control (instrumental only)

---

## ADDITIONAL STYLE KEYWORDS

### **By Emotion**
Anthemic, Emotional, Happy, Jubilant, Melancholy, Sad, Aggressive, Banger, Power, Stadium, Stomp

### **By Energy**
Danceable, Groovy, Tipsy, Frenetic, Energetic, Chill, Ambient, Slow, Minimal

### **By Aesthetic**
Broadway, Cabaret, Lounge, Operatic, Vegas, Ethereal, Majestic, Mysterious, Cinematic, Glam, Glitter

### **By Production**
Bedroom, Lo-fi, Hi-fi, Raw, Polished, Distorted, Glitchy, Haunted, Hollow

### **Cultural/Regional**
German Schlager, K-pop, J-pop, Latin, World, Regional styles

---

## TROUBLESHOOTING

**Problem:** Music doesn't match mood
**Solution:** Be more explicit with mood keywords, add 2-3 emotion descriptors

**Problem:** Wrong genre
**Solution:** Lead with genre, use subgenre, add "no [unwanted genre]" to negative tags

**Problem:** Wrong tempo
**Solution:** Include specific BPM, use multiple tempo descriptors

**Problem:** Unwanted instruments
**Solution:** Use `negative_tags` parameter, be explicit about desired instruments

**Problem:** Poor vocals
**Solution:** Specify vocal style, use gender parameter, try different prompts

**Problem:** Repetitive
**Solution:** Add "dynamic shifts," "varied structure," request bridge/breakdown

**Problem:** Muddy mix
**Solution:** Specify production style: "clean, bright mix" or "separated layers"

---

## QUICK REFERENCE: PROMPT TEMPLATE

```
Genre: [Primary Genre], [Subgenre]
Mood: [Emotion 1], [Emotion 2]
Tempo: [BPM or descriptor]
Instruments: [Instrument 1], [Instrument 2], [Instrument 3]
Vocals: [Male/Female/Instrumental], [Style descriptor]
Production: [Clean/Lo-fi/Raw/Polished]
Structure: [Intro-Verse-Chorus pattern]

Additional Details:
- [Specific sound/effect]
- [Era/reference style]
- [Dynamic changes]

Negative Tags: [Things to avoid]
```

**Example:**
```
Genre: Synthwave, Retrowave
Mood: Nostalgic, energetic, neon-lit
Tempo: 118 BPM, driving beat
Instruments: Analog synthesizer, 808 drums, arpeggiator, bass synth
Vocals: Instrumental only
Production: Vintage 80s, warm analog, slight tape saturation
Structure: Intro with arpeggios, build to drop, breakdown, final climax

Additional Details:
- Include iconic 80s drum fills
- Sidechain compression on bass
- Dreamy pad layers in background

Negative Tags: Acoustic instruments, organic, modern production
```

---

## RESOURCES

**Suno API Docs:**
- https://docs.sunoapi.org/
- https://docs.sunoapi.com/

**Music Analysis:**
- https://music.ai/docs/api/reference/
- librosa documentation: https://librosa.org/

**Google Lyria:**
- https://ai.google.dev/gemini-api/docs/music-generation

**Community Resources:**
- https://github.com/yzfly/awesome-music-prompts
- Suno Discord community
- Reddit: r/SunoAI

---

**Last Updated:** November 2025
**Version:** 1.0 for Bad Apple Project
