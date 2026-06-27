// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Lock, Mail, Key, LogOut, MessageSquare, LayoutDashboard, 
  Briefcase, Code, Award, Loader2, Eye, EyeOff, Trash2, CheckCircle, Circle,
  Plus, Edit3, X
} from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  image_urls: string[];
  live_url: string;
  repo_url: string;
  featured: boolean;
  created_at: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  icon_name: string;
  created_at: string;
}

// Experience interface as specified in the requirements
interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

// Certificate interface as specified in the requirements
interface Certificate {
  id: number;
  title: string;
  credential_provider: string;
  issue_date: string;
  credential_url: string;
  image_url: string | null;
}

export default function AdminPage() {
  // --- Auth States ---
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Dashboard States ---
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // --- Projects States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentEditingProject, setCurrentEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    image_url: "",
    image_urls: [] as string[],
    live_url: "",
    repo_url: "",
    featured: false
  });
  const [selectedProjectImages, setSelectedProjectImages] = useState<File[]>([]);
  const [previewProjectImages, setPreviewProjectImages] = useState<string[]>([]);

  // --- Skills States ---
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [currentEditingSkill, setCurrentEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "",
    icon_name: ""
  });

  // --- Experiences States ---
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [experiencesError, setExperiencesError] = useState<string>("");
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [currentEditingExperience, setCurrentEditingExperience] = useState<Experience | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    role: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: ""
  });

  // --- Certificates States ---
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [currentEditingCertificate, setCurrentEditingCertificate] = useState<Certificate | null>(null);
  const [certificateForm, setCertificateForm] = useState({
    title: "",
    credential_provider: "",
    issue_date: "",
    credential_url: "",
    image_url: ""
  });
  const [selectedCertificateImage, setSelectedCertificateImage] = useState<File | null>(null);
  const [previewCertificateImage, setPreviewCertificateImage] = useState<string | null>(null);

  // Static categories for skills
  const skillCategories = [
    'frontend', 
    'backend', 
    'database', 
    'devops', 
    'design tools', 
    'version control', 
    'data & machine learning', 
    'soft skills'
  ];

  // Helper function to upload image to Supabase Storage
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    if (!file) return null;

    try {
      // Generate unique filename
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('portfolio-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      alert(`Error uploading image: ${error.message}`);
      return null;
    }
  };

  // Cek sesi login saat halaman dimuat
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
      
      // Jika sudah login, fetch messages
      if (session) {
        fetchMessages();
      }
    });

    // Dengarkan perubahan status login (jika login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Jika login, fetch messages
      if (session) {
        fetchMessages();
      } else {
        setMessages([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- TAMBAHKAN KODE INI: Auto Logout (Inactivity Timer) ---
  useEffect(() => {
    // Hanya jalankan timer jika admin sedang login
    if (!session) return;

    let timeoutId: NodeJS.Timeout;

    // Waktu tunggu sebelum auto-logout (Contoh: 15 Menit)
    // 15 menit * 60 detik * 1000 milidetik = 900000 ms
    const INACTIVITY_LIMIT = 15 * 60 * 1000; 

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        alert("Sesi kamu telah berakhir karena tidak ada aktivitas. Silakan login kembali untuk keamanan.");
      }, INACTIVITY_LIMIT);
    };

    // Daftar aktivitas yang dianggap "sedang aktif"
    const activityEvents = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    
    // Pasang 'pendengar' untuk setiap aktivitas
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Mulai timer pertama kali
    resetTimer();

    // Bersihkan event listener jika komponen di-unmount atau user logout
    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session]); 
  // --- AKHIR KODE TAMBAHAN ---

  // Fetch messages when activeTab changes to 'messages'
  useEffect(() => {
    if (activeTab === "messages" && session) {
      fetchMessages();
    }
  }, [activeTab, session]);

  // Fetch projects when activeTab changes to 'projects'
  useEffect(() => {
    if (activeTab === "projects" && session) {
      fetchProjects();
    }
  }, [activeTab, session]);

  // Fetch skills when activeTab changes to 'skills'
  useEffect(() => {
    if (activeTab === "skills" && session) {
      fetchSkills();
    }
  }, [activeTab, session]);

  // Fetch experiences when activeTab changes to 'experiences'
  useEffect(() => {
    if (activeTab === "experiences" && session) {
      fetchExperiences();
    }
  }, [activeTab, session]);

  // Fetch certificates when activeTab changes to 'certificates'
  useEffect(() => {
    if (activeTab === "certificates" && session) {
      fetchCertificates();
    }
  }, [activeTab, session]);

  // Function to fetch messages from Supabase
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Function to fetch projects from Supabase
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Function to fetch skills from Supabase
  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setSkills(data || []);
    } catch (error: any) {
      console.error("Error fetching skills:", error.message);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Function to fetch experiences from Supabase
  const fetchExperiences = async () => {
    try {
      setLoadingExperiences(true);
      setExperiencesError("");

      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setExperiences(data || []);
    } catch (error: any) {
      const message = error?.message || "Failed to load experiences.";
      console.error("Error fetching experiences:", message);
      setExperiencesError(message);
    } finally {
      setLoadingExperiences(false);
    }
  };

  // Function to fetch certificates from Supabase
  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
    } catch (error: any) {
      console.error("Error fetching certificates:", error.message);
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Function to mark message as read
  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
    } catch (error: any) {
      console.error("Error marking message as read:", error.message);
    }
  };

  // Function to delete message
  const deleteMessage = async (id: number) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error: any) {
      console.error("Error deleting message:", error.message);
    }
  };

  // Function to handle project form input changes
  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setProjectForm(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setProjectForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to handle project image selection
  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedProjectImages(files);
      
      // Create previews for selected images
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewProjectImages(newPreviews);
    }
  };

  // Function to remove a selected image
  const removeSelectedImage = (index: number) => {
    const newSelectedImages = [...selectedProjectImages];
    newSelectedImages.splice(index, 1);
    setSelectedProjectImages(newSelectedImages);
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewProjectImages[index]);
    
    const newPreviews = [...previewProjectImages];
    newPreviews.splice(index, 1);
    setPreviewProjectImages(newPreviews);
  };

  // Function to handle skill form input changes
  const handleSkillFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSkillForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to open modal for adding new project
  const openNewProjectModal = () => {
    setCurrentEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      tech_stack: "",
      image_url: "",
      image_urls: [],
      live_url: "",
      repo_url: "",
      featured: false
    });
    setSelectedProjectImages([]);
    setPreviewProjectImages([]);
    setIsProjectModalOpen(true);
  };

  // Function to open modal for editing project
  const openEditProjectModal = (project: Project) => {
    setCurrentEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack,
      image_url: project.image_url,
      image_urls: project.image_urls || [],
      live_url: project.live_url,
      repo_url: project.repo_url,
      featured: project.featured
    });
    setSelectedProjectImages([]);
    setPreviewProjectImages(project.image_urls || []);
    setIsProjectModalOpen(true);
  };

  // Function to open modal for adding new skill
  const openNewSkillModal = () => {
    setCurrentEditingSkill(null);
    setSkillForm({
      name: "",
      category: skillCategories[0], // Default to first category
      icon_name: ""
    });
    setIsSkillModalOpen(true);
  };

  // Function to open modal for editing skill
  const openEditSkillModal = (skill: Skill) => {
    setCurrentEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      icon_name: skill.icon_name
    });
    setIsSkillModalOpen(true);
  };

  // Function to close project modal
  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setCurrentEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      tech_stack: "",
      image_url: "",
      image_urls: [],
      live_url: "",
      repo_url: "",
      featured: false
    });
    setSelectedProjectImages([]);
    setPreviewProjectImages([]);
  };

  // Function to close skill modal
  const closeSkillModal = () => {
    setIsSkillModalOpen(false);
    setCurrentEditingSkill(null);
    setSkillForm({
      name: "",
      category: skillCategories[0],
      icon_name: ""
    });
  };

  // Function to submit project form
  const submitProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!projectForm.title.trim()) {
        alert("Title is required");
        return;
      }
      
      if (!projectForm.description.trim()) {
        alert("Description is required");
        return;
      }
      
      // Parse tech stack as array
      const techStackArray = projectForm.tech_stack.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      let imageUrls: string[] = [];
      
      // If new images were selected, upload them to Supabase
      if (selectedProjectImages.length > 0) {
        const uploadPromises = selectedProjectImages.map(file => uploadImage(file, 'projects'));
        const uploadedUrls = await Promise.all(uploadPromises);
        imageUrls = uploadedUrls.filter(url => url !== null) as string[];
      } else {
        // Keep existing image URLs if no new images were selected
        imageUrls = projectForm.image_urls;
      }
      
      if (currentEditingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: projectForm.title,
            description: projectForm.description,
            tech_stack: techStackArray,
            image_urls: imageUrls,
            live_url: projectForm.live_url,
            repo_url: projectForm.repo_url,
            featured: projectForm.featured
          })
          .eq('id', currentEditingProject.id);

        if (error) throw error;
        
        alert("Project updated successfully!");
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: projectForm.title,
            description: projectForm.description,
            tech_stack: techStackArray,
            image_urls: imageUrls,
            live_url: projectForm.live_url,
            repo_url: projectForm.repo_url,
            featured: projectForm.featured
          }]);

        if (error) throw error;
        
        alert("Project added successfully!");
      }
      
      // Refresh projects list and close modal
      await fetchProjects();
      closeProjectModal();
    } catch (error: any) {
      console.error("Error saving project:", error.message);
      alert(`Error saving project: ${error.message}`);
    }
  };

  // Function to submit skill form
  const submitSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!skillForm.name.trim()) {
        alert("Skill name is required");
        return;
      }
      
      if (!skillForm.category.trim()) {
        alert("Category is required");
        return;
      }
      
      if (!skillForm.icon_name.trim()) {
        alert("Icon name is required");
        return;
      }
      
      if (currentEditingSkill) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update({
            name: skillForm.name,
            category: skillForm.category,
            icon_name: skillForm.icon_name
          })
          .eq('id', currentEditingSkill.id);

        if (error) throw error;
        
        alert("Skill updated successfully!");
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert([{
            name: skillForm.name,
            category: skillForm.category,
            icon_name: skillForm.icon_name
          }]);

        if (error) throw error;
        
        alert("Skill added successfully!");
      }
      
      // Refresh skills list and close modal
      await fetchSkills();
      closeSkillModal();
    } catch (error: any) {
      console.error("Error saving skill:", error.message);
      alert(`Error saving skill: ${error.message}`);
    }
  };

  

  // Function to delete project
  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh projects list
      await fetchProjects();
      alert("Project deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting project:", error.message);
      alert(`Error deleting project: ${error.message}`);
    }
  };

  // Function to delete skill
  const deleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh skills list
      await fetchSkills();
      alert("Skill deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting skill:", error.message);
      alert(`Error deleting skill: ${error.message}`);
    }
  };

  // Function to handle experience form input changes
  const handleExperienceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setExperienceForm(prev => ({
        ...prev,
        [name]: target.checked,
        // If is_current is checked, clear end_date
        ...(name === 'is_current' && target.checked ? { end_date: '' } : {})
      }));
    } else {
      setExperienceForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to open modal for adding new experience
  const openNewExperienceModal = () => {
    setCurrentEditingExperience(null);
    setExperienceForm({
      role: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    });
    setIsExperienceModalOpen(true);
  };

  // Function to open modal for editing experience
  const openEditExperienceModal = (experience: Experience) => {
    setCurrentEditingExperience(experience);
    setExperienceForm({
      role: experience.role,
      company: experience.company,
      location: experience.location,
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      is_current: experience.is_current,
      description: experience.description
    });
    setIsExperienceModalOpen(true);
  };

  // Function to close experience modal
  const closeExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setCurrentEditingExperience(null);
    setExperienceForm({
      role: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    });
  };

  // Function to submit experience form
  const submitExperienceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!experienceForm.role.trim()) {
        alert("Role is required");
        return;
      }
      
      if (!experienceForm.company.trim()) {
        alert("Company is required");
        return;
      }
      
      if (!experienceForm.location.trim()) {
        alert("Location is required");
        return;
      }
      
      if (!experienceForm.start_date.trim()) {
        alert("Start date is required");
        return;
      }
      
      // Validate dates
      if (!experienceForm.is_current && !experienceForm.end_date.trim()) {
        alert("End date is required when not currently working here");
        return;
      }
      
      if (!experienceForm.is_current && experienceForm.end_date && new Date(experienceForm.start_date) > new Date(experienceForm.end_date)) {
        alert("End date must be after start date");
        return;
      }
      
      if (currentEditingExperience) {
        // Update existing experience
        const { error } = await supabase
          .from('experiences')
          .update({
            role: experienceForm.role,
            company: experienceForm.company,
            location: experienceForm.location,
            start_date: experienceForm.start_date,
            end_date: experienceForm.is_current ? null : experienceForm.end_date || null,
            is_current: experienceForm.is_current,
            description: experienceForm.description
          })
          .eq('id', currentEditingExperience.id);

        if (error) throw error;
        
        alert("Experience updated successfully!");
      } else {
        // Create new experience
        const { error } = await supabase
          .from('experiences')
          .insert([{
            role: experienceForm.role,
            company: experienceForm.company,
            location: experienceForm.location,
            start_date: experienceForm.start_date,
            end_date: experienceForm.is_current ? null : experienceForm.end_date || null,
            is_current: experienceForm.is_current,
            description: experienceForm.description
          }]);

        if (error) throw error;
        
        alert("Experience added successfully!");
      }
      
      // Refresh experiences list and close modal
      await fetchExperiences();
      closeExperienceModal();
    } catch (error: any) {
      console.error("Error saving experience:", error.message);
      alert(`Error saving experience: ${error.message}`);
    }
  };

  // Function to delete experience
  const deleteExperience = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh experiences list
      await fetchExperiences();
      alert("Experience deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting experience:", error.message);
      alert(`Error deleting experience: ${error.message}`);
    }
  };

  // Function to handle certificate form input changes
  const handleCertificateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCertificateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle certificate image selection
  const handleCertificateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedCertificateImage(file);
      setPreviewCertificateImage(URL.createObjectURL(file));
    }
  };

  // Function to open modal for adding new certificate
  const openNewCertificateModal = () => {
    setCurrentEditingCertificate(null);
    setCertificateForm({
      title: "",
      credential_provider: "",
      issue_date: "",
      credential_url: "",
      image_url: ""
    });
    setSelectedCertificateImage(null);
    setPreviewCertificateImage(null);
    setIsCertificateModalOpen(true);
  };

  // Function to open modal for editing certificate
  const openEditCertificateModal = (certificate: Certificate) => {
    setCurrentEditingCertificate(certificate);
    setCertificateForm({
      title: certificate.title,
      credential_provider: certificate.credential_provider,
      issue_date: certificate.issue_date,
      credential_url: certificate.credential_url,
      image_url: certificate.image_url || ""
    });
    setSelectedCertificateImage(null);
    setPreviewCertificateImage(certificate.image_url);
    setIsCertificateModalOpen(true);
  };

  // Function to close certificate modal
  const closeCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setCurrentEditingCertificate(null);
    setCertificateForm({
      title: "",
      credential_provider: "",
      issue_date: "",
      credential_url: "",
      image_url: ""
    });
    setSelectedCertificateImage(null);
    setPreviewCertificateImage(null);
  };

  // Function to submit certificate form
  const submitCertificateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!certificateForm.title.trim()) {
        alert("Certificate title is required");
        return;
      }
      
      if (!certificateForm.credential_provider.trim()) {
        alert("Credential provider is required");
        return;
      }
      
      if (!certificateForm.issue_date.trim()) {
        alert("Issue date is required");
        return;
      }
      
      let imageUrl = certificateForm.image_url || null;
      
      // If a new image was selected, upload it to Supabase
      if (selectedCertificateImage) {
        imageUrl = await uploadImage(selectedCertificateImage, 'certificates');
        if (!imageUrl) {
          return; // Error already shown in uploadImage function
        }
      }
      
      if (currentEditingCertificate) {
        // Update existing certificate
        const { error } = await supabase
          .from('certificates')
          .update({
            title: certificateForm.title,
            credential_provider: certificateForm.credential_provider,
            issue_date: certificateForm.issue_date,
            credential_url: certificateForm.credential_url,
            image_url: imageUrl
          })
          .eq('id', currentEditingCertificate.id);

        if (error) throw error;
        
        alert("Certificate updated successfully!");
      } else {
        // Create new certificate
        const { error } = await supabase
          .from('certificates')
          .insert([{
            title: certificateForm.title,
            credential_provider: certificateForm.credential_provider,
            issue_date: certificateForm.issue_date,
            credential_url: certificateForm.credential_url,
            image_url: imageUrl
          }]);

        if (error) throw error;
        
        alert("Certificate added successfully!");
      }
      
      // Refresh certificates list and close modal
      await fetchCertificates();
      closeCertificateModal();
    } catch (error: any) {
      console.error("Error saving certificate:", error.message);
      alert(`Error saving certificate: ${error.message}`);
    }
  };

  // Function to delete certificate
  const deleteCertificate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh certificates list
      await fetchCertificates();
      alert("Certificate deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting certificate:", error.message);
      alert(`Error deleting certificate: ${error.message}`);
    }
  };

  // Fungsi Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      // After successful login, fetch messages
      fetchMessages();
    }
    setIsLoggingIn(false);
  };

  // Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. TAMPILAN LOADING
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-primary-blue flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent-orange animate-spin" />
      </div>
    );
  }

  // 2. TAMPILAN FORM LOGIN (Jika belum ada sesi)
  if (!session) {
    return (
      <div className="min-h-screen bg-primary-blue flex flex-col items-center justify-center p-6 relative">
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="w-full max-w-md bg-primary-light p-8 rounded-3xl border border-slate-700 shadow-[0_0_40px_rgba(249,115,22,0.1)] relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-accent-orange/10 rounded-2xl flex items-center justify-center text-accent-orange mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-slate-400 mt-1">Authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium text-center">
                {authError}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-primary-blue rounded-xl border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-primary-blue rounded-xl border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-accent-orange hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-accent-orange/30 disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. TAMPILAN DASHBOARD ADMIN (Jika sudah login)
  const menuItems = [
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "projects", label: "Projects", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experiences", label: "Experiences", icon: Briefcase },
    { id: "certificates", label: "Certificates", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-primary-blue text-slate-200 flex pt-24 pb-12 px-6">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-primary-light p-6 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Admin Menu</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                      ${isActive 
                        ? "bg-accent-orange text-white shadow-lg shadow-accent-orange/20" 
                        : "text-slate-400 hover:bg-primary-blue hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-700 mt-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-sm"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-primary-light p-8 rounded-2xl border border-slate-700 relative overflow-hidden min-h-[500px]">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <LayoutDashboard className="w-64 h-64" />
           </div>
           
           <div className="relative z-10">
             <h2 className="text-2xl font-bold text-white capitalize mb-6 flex items-center gap-2">
                {activeTab} Management
             </h2>
             
             {/* Messages Tab Content */}
             {activeTab === "messages" && (
               <div className="overflow-x-auto">
                 {loadingMessages ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <Loader2 className="w-10 h-10 mb-4 text-accent-orange animate-spin" />
                     <p className="text-slate-400">Loading messages...</p>
                   </div>
                 ) : (
                   <table className="min-w-full divide-y divide-slate-700">
                     <thead>
                       <tr>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-700">
                       {messages.length > 0 ? (
                         messages.map((msg) => (
                           <tr key={msg.id} className={msg.is_read ? "" : "bg-slate-800/30"}>
                             <td className="px-4 py-4 whitespace-nowrap">
                               <div className="flex items-center">
                                 {!msg.is_read ? (
                                   <div className="flex items-center">
                                     <div className="w-3 h-3 bg-accent-orange rounded-full mr-2 animate-pulse"></div>
                                     <span className="text-accent-orange text-sm font-medium">Unread</span>
                                   </div>
                                 ) : (
                                   <div className="flex items-center">
                                     <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                     <span className="text-green-500 text-sm font-medium">Read</span>
                                   </div>
                                 )}
                               </div>
                             </td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{msg.name}</td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{msg.email}</td>
                             <td className="px-4 py-4 text-sm text-slate-300 max-w-xs truncate">{msg.message}</td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">
                               {new Date(msg.created_at).toLocaleDateString()}
                             </td>
                             <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                               <div className="flex items-center space-x-2">
                                 {!msg.is_read && (
                                   <button
                                     onClick={() => markAsRead(msg.id)}
                                     className="text-accent-orange hover:text-accent-hover transition-colors"
                                     title="Mark as read"
                                   >
                                     <Eye className="w-5 h-5" />
                                   </button>
                                 )}
                                 <button
                                   onClick={() => deleteMessage(msg.id)}
                                   className="text-red-400 hover:text-red-300 transition-colors"
                                   title="Delete message"
                                 >
                                   <Trash2 className="w-5 h-5" />
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                           <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                             No messages found
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 )}
               </div>
             )}
             
             {/* Projects Tab Content */}
             {activeTab === "projects" && (
               <div className="overflow-x-auto">
                 {loadingProjects ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <Loader2 className="w-10 h-10 mb-4 text-accent-orange animate-spin" />
                     <p className="text-slate-400">Loading projects...</p>
                   </div>
                 ) : (
                   <>
                     <div className="mb-6">
                       <button 
                         onClick={openNewProjectModal}
                         className="py-2.5 px-4 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30 flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         Add New Project
                       </button>
                     </div>
                     
                     <table className="min-w-full divide-y divide-slate-700">
                       <thead>
                         <tr>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tech Stack</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-700">
                         {projects.length > 0 ? (
                           projects.map((project) => (
                             <tr key={project.id}>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{project.title}</td>
                               <td className="px-4 py-4 text-sm text-slate-300">{Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack}</td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm">
                                 {project.featured ? (
                                   <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Yes</span>
                                 ) : (
                                   <span className="px-2 py-1 bg-slate-600 text-slate-400 rounded-full text-xs font-medium">No</span>
                                 )}
                               </td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">
                                 {new Date(project.created_at).toLocaleDateString()}
                               </td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                 <div className="flex items-center space-x-2">
                                   <button
                                     onClick={() => openEditProjectModal(project)}
                                     className="text-accent-orange hover:text-accent-hover transition-colors"
                                     title="Edit project"
                                   >
                                     <Edit3 className="w-5 h-5" />
                                   </button>
                                   <button
                                     onClick={() => deleteProject(project.id)}
                                     className="text-red-400 hover:text-red-300 transition-colors"
                                     title="Delete project"
                                   >
                                     <Trash2 className="w-5 h-5" />
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                               No projects found
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </>
                 )}
               </div>
             )}
             
             {/* Skills Tab Content */}
             {activeTab === "skills" && (
               <div className="overflow-x-auto">
                 {loadingSkills ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <Loader2 className="w-10 h-10 mb-4 text-accent-orange animate-spin" />
                     <p className="text-slate-400">Loading skills...</p>
                   </div>
                 ) : (
                   <>
                     <div className="mb-6">
                       <button 
                         onClick={openNewSkillModal}
                         className="py-2.5 px-4 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30 flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         Add New Skill
                       </button>
                     </div>
                     
                     {/* Group skills by category */}
                     {skillCategories.map(category => {
                       const categorySkills = skills.filter(skill => skill.category === category);
                       if (categorySkills.length === 0) return null;
                       
                       return (
                         <div key={category} className="mb-8">
                           <h3 className="text-lg font-semibold text-white mb-4 capitalize">{category}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {categorySkills.map(skill => (
                               <div 
                                 key={skill.id} 
                                 className="bg-primary-blue p-4 rounded-lg border border-slate-700 flex justify-between items-center"
                               >
                                 <div>
                                   <h4 className="font-medium text-white">{skill.name}</h4>
                                   <p className="text-sm text-slate-400">{skill.icon_name}</p>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <button
                                     onClick={() => openEditSkillModal(skill)}
                                     className="text-accent-orange hover:text-accent-hover transition-colors"
                                     title="Edit skill"
                                   >
                                     <Edit3 className="w-5 h-5" />
                                   </button>
                                   <button
                                     onClick={() => deleteSkill(skill.id)}
                                     className="text-red-400 hover:text-red-300 transition-colors"
                                     title="Delete skill"
                                   >
                                     <Trash2 className="w-5 h-5" />
                                   </button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       );
                     })}
                     
                     {/* Show categories with no skills */}
                     {skillCategories.filter(category => !skills.some(skill => skill.category === category)).map(category => (
                       <div key={category} className="mb-8">
                         <h3 className="text-lg font-semibold text-white mb-4 capitalize">{category}</h3>
                         <div className="text-center py-8 text-slate-500">
                           No skills in this category yet
                         </div>
                       </div>
                     ))}
                   </>
                 )}
               </div>
             )}
             
             {/* Experiences Tab Content */}
             {activeTab === "experiences" && (
               <div className="overflow-x-auto">
                 {loadingExperiences ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <Loader2 className="w-10 h-10 mb-4 text-accent-orange animate-spin" />
                     <p className="text-slate-400">Loading experiences...</p>
                   </div>
                 ) : experiencesError ? (
                   <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
                     <p className="font-semibold mb-2">Unable to load experiences.</p>
                     <p className="text-sm text-red-100">{experiencesError}</p>
                     <button
                       onClick={fetchExperiences}
                       className="mt-4 inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition"
                     >
                       Retry
                     </button>
                   </div>
                 ) : (
                   <>
                     <div className="mb-6">
                       <button 
                         onClick={openNewExperienceModal}
                         className="py-2.5 px-4 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30 flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         Add New Experience
                       </button>
                     </div>
                     
                     <table className="min-w-full divide-y divide-slate-700">
                       <thead>
                         <tr>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-700">
                         {experiences.length > 0 ? (
                           experiences.map((exp) => (
                             <tr key={exp.id}>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{exp.role}</td>
                               <td className="px-4 py-4 text-sm text-slate-300">{exp.company}</td>
                               <td className="px-4 py-4 text-sm text-slate-300">{exp.location}</td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                                 {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "N/A"}
                               </td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                 <div className="flex items-center space-x-2">
                                   <button
                                     onClick={() => openEditExperienceModal(exp)}
                                     className="text-accent-orange hover:text-accent-hover transition-colors"
                                     title="Edit experience"
                                   >
                                     <Edit3 className="w-5 h-5" />
                                   </button>
                                   <button
                                     onClick={() => deleteExperience(exp.id)}
                                     className="text-red-400 hover:text-red-300 transition-colors"
                                     title="Delete experience"
                                   >
                                     <Trash2 className="w-5 h-5" />
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                               No experiences found
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </>
                 )}
               </div>
             )}
             
             {/* Certificates Tab Content */}
             {activeTab === "certificates" && (
               <div className="overflow-x-auto">
                 {loadingCertificates ? (
                   <div className="flex flex-col items-center justify-center py-12">
                     <Loader2 className="w-10 h-10 mb-4 text-accent-orange animate-spin" />
                     <p className="text-slate-400">Loading certificates...</p>
                   </div>
                 ) : (
                   <>
                     <div className="mb-6">
                       <button 
                         onClick={openNewCertificateModal}
                         className="py-2.5 px-4 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30 flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         Add New Certificate
                       </button>
                     </div>
                     
                     <table className="min-w-full divide-y divide-slate-700">
                       <thead>
                         <tr>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Credential Provider</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Issue Date</th>
                           <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-700">
                         {certificates.length > 0 ? (
                           certificates.map((cert) => (
                             <tr key={cert.id}>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{cert.title}</td>
                               <td className="px-4 py-4 text-sm text-slate-300">{cert.credential_provider}</td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                                 {new Date(cert.issue_date).toLocaleDateString()}
                               </td>
                               <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                 <div className="flex items-center space-x-2">
                                   <button
                                     onClick={() => openEditCertificateModal(cert)}
                                     className="text-accent-orange hover:text-accent-hover transition-colors"
                                     title="Edit certificate"
                                   >
                                     <Edit3 className="w-5 h-5" />
                                   </button>
                                   <button
                                     onClick={() => deleteCertificate(cert.id)}
                                     className="text-red-400 hover:text-red-300 transition-colors"
                                     title="Delete certificate"
                                   >
                                     <Trash2 className="w-5 h-5" />
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                               No certificates found
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </>
                 )}
               </div>
             )}
             
             {/* Placeholder for other tabs */}
             {activeTab !== "messages" && activeTab !== "projects" && activeTab !== "skills" && activeTab !== "experiences" && activeTab !== "certificates" && (
               <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center flex flex-col items-center justify-center text-slate-500">
                 <Loader2 className="w-10 h-10 mb-4 text-slate-600 animate-spin" />
                 <p>Modul <strong className="text-slate-400 capitalize">{activeTab}</strong> sedang disiapkan...</p>
               </div>
             )}
           </div>
        </main>

      </div>
      
      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary-light rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {currentEditingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <button 
                  onClick={closeProjectModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={submitProjectForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="Project title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all min-h-[100px]"
                    placeholder="Project description"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    name="tech_stack"
                    value={projectForm.tech_stack}
                    onChange={handleProjectFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="e.g., React, TypeScript, Tailwind CSS (comma separated)"
                  />
                </div>
                
                {/* Multi-Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Project Images</label>
                  <div className="space-y-2">
                    {/* Preview thumbnails */}
                    {previewProjectImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {previewProjectImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={preview} 
                              alt={`Preview ${index}`} 
                              className="max-h-20 object-contain rounded-lg border border-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* File input */}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleProjectImageChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-orange file:text-white hover:file:bg-accent-hover"
                    />
                    <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP. Maximum size: 5MB. Hold Ctrl/Cmd to select multiple files.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Live URL</label>
                    <input
                      type="text"
                      name="live_url"
                      value={projectForm.live_url}
                      onChange={handleProjectFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      placeholder="Live demo URL"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Repo URL</label>
                    <input
                      type="text"
                      name="repo_url"
                      value={projectForm.repo_url}
                      onChange={handleProjectFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      placeholder="Repository URL"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={projectForm.featured}
                    onChange={handleProjectFormChange}
                    className="h-4 w-4 text-accent-orange bg-primary-blue border-slate-700 rounded focus:ring-accent-orange focus:ring-1"
                  />
                  <label className="ml-2 block text-sm font-medium text-slate-300">
                    Featured Project
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeProjectModal}
                    className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30"
                  >
                    {currentEditingProject ? "Update Project" : "Add Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary-light rounded-2xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {currentEditingSkill ? "Edit Skill" : "Add New Skill"}
                </h3>
                <button 
                  onClick={closeSkillModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={submitSkillForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={skillForm.name}
                    onChange={handleSkillFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="Skill name (e.g. Next.js, Laravel, Python)"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    name="category"
                    value={skillForm.category}
                    onChange={handleSkillFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    required
                  >
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Icon Name *</label>
                  <input
                    type="text"
                    name="icon_name"
                    value={skillForm.icon_name}
                    onChange={handleSkillFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="Icon name (e.g. SiNextdotjs, SiLaravel, FaBrain)"
                    required
                  />
                  <p className="mt-1 text-xs text-slate-400">Enter the icon name that corresponds to the icon mapping in the About page</p>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeSkillModal}
                    className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30"
                  >
                    {currentEditingSkill ? "Update Skill" : "Add Skill"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Experience Modal */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary-light rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {currentEditingExperience ? "Edit Experience" : "Add New Experience"}
                </h3>
                <button 
                  onClick={closeExperienceModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={submitExperienceForm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Role / Position *</label>
                    <input
                      type="text"
                      name="role"
                      value={experienceForm.role}
                      onChange={handleExperienceFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      placeholder="Fullstack Web Developer, Coordinator of Student Affairs"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      name="company"
                      value={experienceForm.company}
                      onChange={handleExperienceFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      placeholder="Dinas Pariwisata, BEM KM UMRAH"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={experienceForm.location}
                    onChange={handleExperienceFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="Tanjungpinang, Riau Islands"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Start Date *</label>
                    <input
                      type="date"
                      name="start_date"
                      value={experienceForm.start_date}
                      onChange={handleExperienceFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={experienceForm.end_date}
                      onChange={handleExperienceFormChange}
                      className={`w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all ${
                        experienceForm.is_current ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={experienceForm.is_current}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={experienceForm.is_current}
                    onChange={handleExperienceFormChange}
                    className="h-4 w-4 text-accent-orange bg-primary-blue border-slate-700 rounded focus:ring-accent-orange focus:ring-1"
                  />
                  <label className="ml-2 block text-sm font-medium text-slate-300">
                    Currently work here
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={handleExperienceFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all min-h-[100px]"
                    placeholder="Write details about your responsibilities, achievements, or tasks..."
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeExperienceModal}
                    className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30"
                  >
                    {currentEditingExperience ? "Update Experience" : "Add Experience"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Certificate Modal */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary-light rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {currentEditingCertificate ? "Edit Certificate" : "Add New Certificate"}
                </h3>
                <button 
                  onClick={closeCertificateModal}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={submitCertificateForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Certificate Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={certificateForm.title}
                    onChange={handleCertificateFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="AWS Certified Developer, Google Analytics Individual Qualification"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Credential Provider *</label>
                  <input
                    type="text"
                    name="credential_provider"
                    value={certificateForm.credential_provider}
                    onChange={handleCertificateFormChange}
                    className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                    placeholder="Amazon Web Services, Google, Microsoft"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Issue Date *</label>
                    <input
                      type="date"
                      name="issue_date"
                      value={certificateForm.issue_date}
                      onChange={handleCertificateFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Credential URL</label>
                    <input
                      type="url"
                      name="credential_url"
                      value={certificateForm.credential_url}
                      onChange={handleCertificateFormChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all"
                      placeholder="https://www.credly.com/path/to/certificate"
                    />
                  </div>
                </div>
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Certificate Image</label>
                  <div className="space-y-2">
                    {previewCertificateImage && (
                      <div className="flex justify-center">
                        <img 
                          src={previewCertificateImage} 
                          alt="Preview" 
                          className="max-h-40 object-contain rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCertificateImageChange}
                      className="w-full px-4 py-2.5 bg-primary-blue rounded-lg border border-slate-700 focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none text-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-orange file:text-white hover:file:bg-accent-hover"
                    />
                    <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP. Maximum size: 5MB.</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCertificateModal}
                    className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-accent-orange hover:bg-accent-hover text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-accent-orange/30"
                  >
                    {currentEditingCertificate ? "Update Certificate" : "Add Certificate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}