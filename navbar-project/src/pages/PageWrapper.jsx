const PageWrapper = ({ title, children }) => (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 pt-20">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
          {title}
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
           {children}
        </div>
      </main>
    </div>
);
export default PageWrapper;