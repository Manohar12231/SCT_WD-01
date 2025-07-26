import PageWrapper from './PageWrapper';

const Home = () => (
  <PageWrapper title="CSS Navigation Bar">
    <p className="text-xl">
      Having easy-to-use navigation is important for any web site.
      With CSS you can transform boring HTML menus into good-looking navigation bars.</p>
    <p>
      A navigation bar needs standard HTML as a base.
    </p>
    <p className="h-[150vh] text-center text-slate-500 pt-16">
      (Scroll down to view the sticky navigation bar and its dynamic styling)
    </p>
  </PageWrapper>
);
export default Home;