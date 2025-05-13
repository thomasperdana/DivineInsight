import type { Book, LexiconEntry } from '@/types';

export const KJV_BIBLE_DATA: Book[] = [
  {
    name: 'Genesis',
    abbreviation: 'Gen',
    chapters: [
      {
        chapter: 1,
        verses: [
          { book_name: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
          { book_name: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
          { book_name: 'Genesis', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
          { book_name: 'Genesis', chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
          { book_name: 'Genesis', chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
          { book_name: 'Genesis', chapter: 1, verse: 6, text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.' },
          { book_name: 'Genesis', chapter: 1, verse: 7, text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.' },
          { book_name: 'Genesis', chapter: 1, verse: 8, text: 'And God called the firmament Heaven. And the evening and the morning were the second day.' },
          { book_name: 'Genesis', chapter: 1, verse: 9, text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.' },
          { book_name: 'Genesis', chapter: 1, verse: 10, text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.' },
        ],
      },
      {
        chapter: 2,
        verses: [
          { book_name: 'Genesis', chapter: 2, verse: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.' },
          { book_name: 'Genesis', chapter: 2, verse: 2, text: 'And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.' },
          { book_name: 'Genesis', chapter: 2, verse: 3, text: 'And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.' },
        ],
      },
    ],
  },
  {
    name: 'Exodus',
    abbreviation: 'Exo',
    chapters: [
      {
        chapter: 1,
        verses: [
          { book_name: 'Exodus', chapter: 1, verse: 1, text: 'Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.' },
          { book_name: 'Exodus', chapter: 1, verse: 2, text: 'Reuben, Simeon, Levi, and Judah,' },
        ],
      },
    ],
  },
   {
    name: 'John',
    abbreviation: 'Joh',
    chapters: [
      {
        chapter: 1,
        verses: [
          { book_name: 'John', chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
          { book_name: 'John', chapter: 1, verse: 2, text: 'The same was in the beginning with God.' },
          { book_name: 'John', chapter: 1, verse: 3, text: 'All things were made by him; and without him was not any thing made that was made.' },
          { book_name: 'John', chapter: 1, verse: 14, text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.'}
        ],
      },
    ],
  },
];

export const LEXICON_DATA: LexiconEntry[] = [
  { term: 'Agape', definition: 'Selfless, sacrificial, unconditional love, the highest form of love.', greek: 'ἀγάπη' },
  { term: 'Logos', definition: 'The Word; a concept referring to divine reason or plan, often identified with Jesus Christ.', greek: 'λόγος' },
  { term: 'Shalom', definition: 'Peace, harmony, wholeness, completeness, prosperity, welfare and tranquility.', hebrew: 'שָׁלוֹם' },
  { term: 'Amen', definition: 'So be it; truly. An affirmation of truth or agreement.', hebrew: 'אָמֵן' },
  { term: 'Hallelujah', definition: 'Praise the Lord. An expression of worship or rejoicing.', hebrew: 'הַלְלוּיָהּ' },
];

export const ALL_BOOKS = KJV_BIBLE_DATA.map(book => ({ name: book.name, abbreviation: book.abbreviation }));
