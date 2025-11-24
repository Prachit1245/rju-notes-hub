import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Download, Star, Calendar, FileText, Image, FileAudio, FileVideo, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  download_count: number;
  rating_sum: number;
  rating_count: number;
  tags: string[] | null;
  uploader_name: string | null;
  uploader_email: string | null;
  created_at: string;
  is_verified: boolean;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  program_id: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
}

interface Faculty {
  id: string;
  name: string;
  code: string;
}

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNoteData = async () => {
      try {
        // Fetch note
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();

        if (noteError) throw noteError;
        setNote(noteData);

        // Fetch subject
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', noteData.subject_id)
          .single();

        if (subjectError) throw subjectError;
        setSubject(subjectData);

        // Fetch program
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', subjectData.program_id)
          .single();

        if (programError) throw programError;
        setProgram(programData);

        // Fetch faculty
        const { data: facultyData, error: facultyError } = await supabase
          .from('faculties')
          .select('*')
          .eq('id', programData.faculty_id)
          .single();

        if (facultyError) throw facultyError;
        setFaculty(facultyData);

      } catch (error) {
        console.error('Error fetching note data:', error);
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNoteData();
  }, [id, navigate]);

  const getFileIcon = () => {
    if (!note) return <FileText className="h-8 w-8" />;
    if (note.file_type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (note.file_type.startsWith('audio/')) return <FileAudio className="h-8 w-8" />;
    if (note.file_type.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async () => {
    if (!note) return;
    
    // Increment download count
    await supabase
      .from('notes')
      .update({ download_count: note.download_count + 1 })
      .eq('id', note.id);

    // Open file
    window.open(note.file_url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note || !subject || !program || !faculty) {
    return null;
  }

  const rating = note.rating_count > 0 ? (note.rating_sum / note.rating_count).toFixed(1) : 'No ratings';
  const pageTitle = `${note.title} - ${subject.name} Notes | RJU Notes`;
  const pageDescription = note.description || `Download ${note.title} for ${subject.name}, Semester ${subject.semester}, ${program.name}, ${faculty.name}. Free study materials for RJU students.`;
  const pageUrl = `https://rjunotes.com/notes/${note.id}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${note.title}, ${subject.name}, ${program.name}, ${faculty.name}, RJU notes, study materials, semester ${subject.semester}, ${note.tags?.join(', ')}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="RJU Notes" />
        <meta property="article:published_time" content={note.created_at} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />

        {/* Structured Data - Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": note.title,
            "description": pageDescription,
            "author": {
              "@type": "Person",
              "name": note.uploader_name || "Anonymous"
            },
            "datePublished": note.created_at,
            "publisher": {
              "@type": "Organization",
              "name": "RJU Notes",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rjunotes.com/rju-notes-logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": pageUrl
            },
            "keywords": note.tags?.join(', ')
          })}
        </script>

        {/* Structured Data - DigitalDocument */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": note.title,
            "description": pageDescription,
            "fileFormat": note.file_type,
            "contentUrl": note.file_url,
            "uploadDate": note.created_at,
            "fileSize": note.file_size ? `${note.file_size} bytes` : undefined,
            "author": {
              "@type": "Person",
              "name": note.uploader_name || "Anonymous"
            },
            "about": {
              "@type": "Course",
              "name": subject.name,
              "courseCode": subject.code,
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "instructor": {
                  "@type": "Organization",
                  "name": faculty.name
                }
              }
            },
            "aggregateRating": note.rating_count > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": (note.rating_sum / note.rating_count).toFixed(1),
              "reviewCount": note.rating_count
            } : undefined
          })}
        </script>

        {/* Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rjunotes.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Notes",
                "item": "https://rjunotes.com/notes"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": faculty.name,
                "item": `https://rjunotes.com/notes?faculty=${faculty.id}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": program.name,
                "item": `https://rjunotes.com/notes?program=${program.id}`
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": subject.name,
                "item": `https://rjunotes.com/notes?subject=${subject.id}`
              },
              {
                "@type": "ListItem",
                "position": 6,
                "name": note.title
              }
            ]
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/notes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>

          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li>/</li>
              <li><Link to="/notes" className="hover:text-foreground">Notes</Link></li>
              <li>/</li>
              <li>{faculty.code}</li>
              <li>/</li>
              <li>{program.code}</li>
              <li>/</li>
              <li>{subject.code}</li>
              <li>/</li>
              <li className="text-foreground font-medium">{note.title}</li>
            </ol>
          </nav>

          <article>
            {/* Main Card */}
            <Card className="shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      <h1>{note.title}</h1>
                    </CardTitle>
                    {note.is_verified && (
                      <Badge variant="secondary" className="mb-2">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                {note.description && (
                  <section>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <CardDescription className="text-base">
                      {note.description}
                    </CardDescription>
                  </section>
                )}

                {/* Course Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Subject</h3>
                    <p className="font-medium">{subject.name} ({subject.code})</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Semester</h3>
                    <p className="font-medium">Semester {subject.semester}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Program</h3>
                    <p className="font-medium">{program.name} ({program.code})</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Faculty</h3>
                    <p className="font-medium">{faculty.name} ({faculty.code})</p>
                  </div>
                </section>

                {/* Stats */}
                <section className="flex flex-wrap items-center gap-6 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="font-semibold">{note.download_count.toLocaleString()}</p>
                    </div>
                  </div>
                  {note.rating_count > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-semibold">
                          {rating} ({note.rating_count} {note.rating_count === 1 ? 'review' : 'reviews'})
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Uploaded</p>
                      <p className="font-semibold">{formatDate(note.created_at)}</p>
                    </div>
                  </div>
                  {note.file_size && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">File Size</p>
                        <p className="font-semibold">{formatFileSize(note.file_size)}</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Uploader Info */}
                {note.uploader_name && (
                  <section className="text-sm text-muted-foreground border-t pt-4">
                    <p>Contributed by <span className="font-medium text-foreground">{note.uploader_name}</span></p>
                  </section>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleDownload}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Now
                  </Button>
                  {note.file_type === 'application/pdf' && (
                    <Button 
                      variant="outline"
                      size="lg"
                      className="flex-1 sm:flex-initial"
                      onClick={() => window.open(note.file_url, '_blank')}
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Preview
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </article>
        </div>
      </main>
    </>
  );
}
