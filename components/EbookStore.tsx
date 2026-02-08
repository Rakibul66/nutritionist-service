import React, { useEffect, useState } from 'react';
import { BookCategory, Ebook } from '../types';
import { fetchEbooks } from '../services/dataService';
import { ShoppingCart, Star } from 'lucide-react';

const EbookStore: React.FC = () => {
  const [books, setBooks] = useState<Ebook[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await fetchEbooks();
      setBooks(data);
      setLoading(false);
    };
    loadBooks();
  }, []);

  const categories = ['All', ...Object.values(BookCategory)];

  const filteredBooks = activeCategory === 'All' 
    ? books 
    : books.filter(b => b.category === activeCategory);

  return (
    <section id="ebooks" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">ইবুক স্টোর</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
             নলেজ হাব: সুস্থতার গাইডলাইন
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'সব বই' : cat}
            </button>
          ))}
        </div>

        {loading ? (
            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
                <div key={book.id} className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-gray-200">
                    <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        4.9
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
                        {book.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{book.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xl font-bold text-gray-900">৳{book.price}</span>
                        <button className="flex items-center bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            কিনুন
                        </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default EbookStore;