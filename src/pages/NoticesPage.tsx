import NoticeBoard from '@/components/NoticeBoard';
import { SEO, SITE_URL } from '@/components/SEO';

const NoticesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="RJU Notices – Latest Announcements from Rajarshi Janak University"
        description="Live notices and announcements from Rajarshi Janak University (RJU), Nepal — exam schedules, results, admissions, and official updates."
        keywords="RJU notices, Rajarshi Janak University notices, RJU announcements, RJU exam notice, RJU results"
        canonical="/notices"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'RJU Notices',
            url: `${SITE_URL}/notices`,
          },
        ]}
      />
      <section className="container px-4 md:px-6 py-8 md:py-12">
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="hero-title-gradient">RJU</span>
            <span className="text-foreground"> Notices</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Latest official announcements, exam schedules, and updates from
            Rajarshi Janak University.
          </p>
        </header>
        <NoticeBoard />
      </section>
    </div>
  );
};

export default NoticesPage;
