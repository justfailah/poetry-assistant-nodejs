
const https = require('https');
const readline = require('readline');

// Function to fetch and process a list of words from the princeton wordlist
function fetchWordList() {
  return new Promise((resolve, reject) => {
    const url = 'https://introcs.cs.princeton.edu/java/data/wordlist.txt';

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        resolve(words);
      });

      res.on('error', (err) => {
        reject('Error fetching word list: ' + err);
      });
    });
  });
}

// Function to define the rhyme pattern by extracting the last three letters of the word
function determineRhymePattern(word) {
  const rhymeLength = 3; 
  return word.slice(-rhymeLength); 
}

// Function to search for and return words that rhyme with the given input word
async function findRhymingWords(input, words) {
  const pattern = determineRhymePattern(input); 

  // Linear search to find rhyming words
  const rhymes = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== input && words[i].endsWith(pattern)) {
      rhymes.push(words[i]);
    }
  }

  // If rhymes are found, return them sorted alphabetically using bubble sort algorithm
  bubbleSort(rhymes);

  if (rhymes.length > 0) {
    return rhymes;
  } else {
    return ["No rhymes found"];
  }
}

// Function to alphabetically sort an array of words using the bubble sort algorithm
function bubbleSort(array) {
  const n = array.length;

  // Outer loop: Iterate through the array
  for (let i = 0; i < n - 1; i++) {
    // Inner loop: Compare each pair of adjacent elements
    for (let j = 0; j < n - i - 1; j++) {
      // Swap elements if they are out of order
      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
}

// Function to count the number of syllables in a word based on vowel clusters
function syllableCount(word) {
  const matches = word.match(/[aeiouy]+/gi); // Match vowel groups
  if (matches) {
    return matches.length; // Return the number of syllable groups if matches are found
  } else {
    return 0; // Return 0 if no vowel groups are found
  }
}

// Function to determine the rhythm of a word based on its syllable count
function calculateRhythm(word) {
  const count = syllableCount(word);
  if (count === 0) {
    return "No rhythm detected";
  } else {
    return `${count} syllable(s)`;
  }
}

// Function to identify words that share the same rhythm as the input word 
function findRhythmMatchingWords(targetRhythm, words) {
  const matchingWords = [];
  for (let i = 0; i < words.length; i++) {
    if (calculateRhythm(words[i]) === targetRhythm) {
      matchingWords.push(words[i]);
    }
  }

  if (matchingWords.length > 0) {
    return matchingWords;
  } else {
    return ["No words with matching rhythm found"];
  }
}

// Function to find words that begin with the same letter as the input word
function findAlliterativeWords(letter, words) {
  const alliteration = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().startsWith(letter.toLowerCase())) {
      alliteration.push(words[i]);
    }
  }

  if (alliteration.length > 0) {
    return alliteration;
  } else {
    return ["No alliterations found"];
  }
}


// Main function to execute the Poetry Assistant, finding rhymes, alliterations, and rhythm-matching words
async function runPoetryAssistant(inputWord) {
  try {
    const words = await fetchWordList();
    // Find rhyming words for the input word
    const rhymes = await findRhymingWords(inputWord, words);
    // Find alliterative words for the input word (first letter)
    const alliteration = findAlliterativeWords(inputWord[0], words);
    // Find rhythm-matching words for the input word
    const rhythmMatchingWords = findRhythmMatchingWords(calculateRhythm(inputWord), words);
    // Output rhymes, alliteration, rhythm matching, and syllable count for the input word
    console.log(`Rhymes for '${inputWord}':`, rhymes);
    console.log(`Alliterations for '${inputWord}':`, alliteration);
    console.log(`Rhythm for '${inputWord}':`, calculateRhythm(inputWord));
    console.log(`Words with matching rhythm for '${inputWord}':`, rhythmMatchingWords);
  } catch (err) {
    console.error(err);
  }
}

// Function to handle user input and initiate the Poetry Assistant
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for a word and then process it using the poetry assistant functions
rl.question('Enter a word to find rhymes, alliteration, and matching rhythm: ', (inputWord) => {
  runPoetryAssistant(inputWord);
  rl.close();
});
