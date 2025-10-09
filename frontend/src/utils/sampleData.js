// Sample data for testing when backend is not available
export const sampleBooks = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    totalQuantity: 5,
    availableQuantity: 3,
    cost: 299,
    pdfLink: 'https://example.com/gatsby.pdf'
  },
  {
    _id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    totalQuantity: 4,
    availableQuantity: 2,
    cost: 349,
    pdfLink: null
  },
  {
    _id: '3',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Academic',
    totalQuantity: 6,
    availableQuantity: 4,
    cost: 1299,
    pdfLink: 'https://example.com/algorithms.pdf'
  },
  {
    _id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    totalQuantity: 3,
    availableQuantity: 1,
    cost: 599,
    pdfLink: null
  },
  {
    _id: '5',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Academic',
    totalQuantity: 8,
    availableQuantity: 5,
    cost: 799,
    pdfLink: 'https://example.com/cleancode.pdf'
  },
  {
    _id: '6',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    totalQuantity: 4,
    availableQuantity: 0,
    cost: 249,
    pdfLink: null
  }
];

export const sampleCategories = ['Fiction', 'Non-Fiction', 'Academic'];
