import { useState } from 'react';
import { Upload, FileText, Image, FileAudio, FileVideo, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFaculties, usePrograms, useSubjects } from '@/hooks/useSupabaseData';

interface FileUpload {
  file: File;
  id: string;
}

export default function UploadPage() {
  const { toast } = useToast();
  const { faculties } = useFaculties();
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const { programs } = usePrograms(selectedFaculty);
  const { subjects } = useSubjects(selectedProgram, selectedSemester ? parseInt(selectedSemester) : undefined);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    uploader_name: '',
    uploader_email: '',
    tags: '',
    customSubjectName: '',
    customSubjectCode: '',
  });
  
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [adminAuth, setAdminAuth] = useState({
    email: '',
    password: '',
    isAuthenticated: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('audio/')) return <FileAudio className="h-5 w-5" />;
    if (type.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const uploadToSupabase = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `notes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('notes')
      .getPublicUrl(filePath);

    return { publicUrl, fileName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasSubject = selectedSubject || (useCustomSubject && formData.customSubjectName);
    
    if (!hasSubject || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select/enter a subject and upload at least one file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Handle custom subject creation if needed
      let finalSubjectId = selectedSubject;
      
      if (useCustomSubject && formData.customSubjectName) {
        // Insert custom subject first
        const { data: customSubject, error: subjectError } = await supabase
          .from('subjects')
          .insert({
            program_id: selectedProgram,
            name: formData.customSubjectName,
            code: formData.customSubjectCode || 'CUSTOM',
            semester: parseInt(selectedSemester),
            credits: 3,
            description: `Custom subject: ${formData.customSubjectName}`
          })
          .select()
          .single();
          
        if (subjectError) throw subjectError;
        finalSubjectId = customSubject.id;
      }
      
      for (const fileUpload of files) {
        const { publicUrl, fileName } = await uploadToSupabase(fileUpload.file);
        
        const { error } = await supabase
          .from('notes')
          .insert({
            subject_id: finalSubjectId,
            title: formData.title || fileUpload.file.name,
            description: formData.description,
            file_url: publicUrl,
            file_name: fileName,
            file_size: fileUpload.file.size,
            file_type: fileUpload.file.type,
            uploader_name: formData.uploader_name,
            uploader_email: formData.uploader_email,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
          });

        if (error) throw error;
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        uploader_name: '',
        uploader_email: '',
        tags: '',
        customSubjectName: '',
        customSubjectCode: '',
      });
      setFiles([]);
      setUseCustomSubject(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!adminAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter admin credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminAuth.email}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@rju.edu.np"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminAuth.password}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login to Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedProgramData = programs.find(p => p.id === selectedProgram);
  const semesterOptions = selectedProgramData 
    ? Array.from({ length: selectedProgramData.total_semesters }, (_, i) => i + 1)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Notes</h1>
          <p className="text-muted-foreground">
            Upload study materials for RJU students
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Selection</CardTitle>
            <CardDescription>
              Select the faculty, program, semester, and subject for your notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Select value={selectedFaculty} onValueChange={(value) => {
                  setSelectedFaculty(value);
                  setSelectedProgram('');
                  setSelectedSemester('');
                  setSelectedSubject('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select 
                  value={selectedProgram} 
                  onValueChange={(value) => {
                    setSelectedProgram(value);
                    setSelectedSemester('');
                    setSelectedSubject('');
                  }}
                  disabled={!selectedFaculty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name} ({program.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select 
                  value={selectedSemester} 
                  onValueChange={(value) => {
                    setSelectedSemester(value);
                    setSelectedSubject('');
                  }}
                  disabled={!selectedProgram}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                {!useCustomSubject ? (
                  <Select 
                    value={selectedSubject} 
                    onValueChange={setSelectedSubject}
                    disabled={!selectedSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter custom subject name"
                      value={formData.customSubjectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customSubjectName: e.target.value }))}
                    />
                    <Input
                      placeholder="Enter subject code (optional)"
                      value={formData.customSubjectCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, customSubjectCode: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="useCustomSubject"
                    checked={useCustomSubject}
                    onChange={(e) => {
                      setUseCustomSubject(e.target.checked);
                      if (e.target.checked) {
                        setSelectedSubject('');
                      } else {
                        setFormData(prev => ({ ...prev, customSubjectName: '', customSubjectCode: '' }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="useCustomSubject" className="text-sm">
                    Add custom subject
                  </Label>
                </div>
                
                {selectedSemester && subjects.length === 0 && !useCustomSubject && (
                  <p className="text-sm text-muted-foreground">
                    No subjects found for this semester. You can add a custom subject instead.
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Note title (optional - defaults to filename)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., lecture, exam, tutorial (comma-separated)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the content of these notes"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uploader_name">Uploader Name</Label>
                  <Input
                    id="uploader_name"
                    value={formData.uploader_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, uploader_name: e.target.value }))}
                    placeholder="Your name (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uploader_email">Uploader Email</Label>
                  <Input
                    id="uploader_email"
                    type="email"
                    value={formData.uploader_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, uploader_email: e.target.value }))}
                    placeholder="your.email@example.com (optional)"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to select
                    </p>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.avi,.mov"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Select Files
                    </Button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files ({files.length})</Label>
                    {files.map((fileUpload) => (
                      <div key={fileUpload.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(fileUpload.file.type)}
                          <div>
                            <p className="text-sm font-medium">{fileUpload.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileUpload.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={uploading || (!selectedSubject && (!useCustomSubject || !formData.customSubjectName)) || files.length === 0}
                className="w-full"
              >
                {uploading 
                  ? 'Uploading...' 
                  : (!selectedSubject && (!useCustomSubject || !formData.customSubjectName))
                    ? 'Please select or enter a subject first'
                    : files.length === 0 
                      ? 'Select files to upload' 
                      : `Upload ${files.length} File(s)`
                }
              </Button>
              
              {(!selectedSubject || files.length === 0) && (
                <div className="text-sm text-muted-foreground text-center">
                  {!selectedSubject && files.length === 0 
                    ? 'Please select a subject and add files to enable upload'
                    : !selectedSubject 
                      ? 'Please select a subject to enable upload'
                      : 'Please add files to enable upload'
                  }
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}