import './index.css';
import angular from 'angular';
import { supabase } from './supabaseClient';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { createIcons, icons } from 'lucide';

const INITIAL_DATA = {
  personalInfo: {
    fullName: "Marcus Sterling",
    jobTitle: "Senior Product Designer",
    email: "marcus.s@vertex.ai",
    phone: "+1 (555) 000-0000",
    linkedin: "linkedin.com/in/marcus",
    location: "San Francisco",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzXQA8Orbfk_o1pDzG_bM2dX1JG3H5A3VpOLwBOCPKCSf_1GqeshBqptOiX8ZFM26kiH-T-L6Rs04QCOszu7kb2vaMMS0n_l605Laib7MpWRx4DlILrAM_v42ovFbSQ1uJcgMImyXBdcKrQ7ZG0LMMTp8ITgf8abg-A6mwbULIXQGRSos5ELoTLC-Us9T_H1O_3zFO23-XWqtVqvKKMKXcZQX84LlJpnHknh3_GiUjBsCflnn75gMPquitXgWMgQkzRlLOz9T8U4"
  },
  summary: "Results-driven Senior Product Designer with 5+ years of experience in creating user-centric digital products. Specializing in design systems and complex enterprise dashboards.",
  experiences: [
    {
      id: "1",
      jobTitle: "Senior Product Designer",
      employer: "Vertex AI Systems",
      city: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: "Led the redesign of the core enterprise dashboard, resulting in a 40% increase in user efficiency and a 25% reduction in churn."
    }
  ],
  education: [
    {
      id: "1",
      degree: "BFA in Interaction Design",
      school: "California College of the Arts",
      city: "San Francisco, CA",
      startDate: "2014",
      endDate: "2018"
    }
  ],
  skills: [
    {
      id: "1",
      category: "Design Systems",
      items: "Figma, Tailwind CSS, React",
      highlightedItems: "Atomic Design"
    }
  ]
};

const app = angular.module('resumeApp', []);

// Lucide icon replacement directive
app.directive('lucideIcon', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope: any, element: any, attrs: any) {
            const updateIcon = (iconName: string) => {
                if (!iconName) return;
                
                // Clear existing content to prevent duplication
                element.empty();
                // Set the attribute that lucide looks for
                element.attr('data-lucide', iconName);
                
                // Use debounce-like approach for createIcons to avoid multiple calls per digest cycle
                if (!(window as any).__lucideTimeout) {
                    (window as any).__lucideTimeout = $timeout(() => {
                        createIcons({ icons: icons });
                        delete (window as any).__lucideTimeout;
                    }, 50);
                }
            };

            attrs.$observe('lucideIcon', updateIcon);
        }
    };
});

// Auth Service
app.service('AuthService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  const service = this;
  service.session = null;
  service.loading = true;

  service.getSession = async () => {
    service.loading = true;
    try {
        const { data } = await supabase.auth.getSession();
        $timeout(() => {
            service.session = data.session;
            service.loading = false;
        });
        return data.session;
    } catch (err) {
        $timeout(() => { service.loading = false; });
        return null;
    }
  };

  service.signOut = async () => {
    await supabase.auth.signOut();
    $timeout(() => {
        service.session = null;
    });
  };

  supabase.auth.onAuthStateChange((_event, session) => {
    $timeout(() => {
        service.session = session;
    });
  });
}]);

// Auth Controller
app.controller('AuthController', ['AuthService', '$scope', '$timeout', function(AuthService, $scope, $timeout) {
    const authCtrl = this;
    authCtrl.email = '';
    authCtrl.password = '';
    authCtrl.isSignUp = false;
    authCtrl.loading = false;
    authCtrl.error = null;

    authCtrl.features = [
        { icon: 'zap', title: "Real-time Preview", description: "See your changes instantly as you type with our high-fidelity live editor." },
        { icon: 'file-check', title: "ATS-Friendly", description: "Our templates are designed to pass through ATS systems with 100% accuracy." },
        { icon: 'shield', title: "Secure Storage", description: "Your data is encrypted and saved safely in your private cloud account." },
        { icon: 'globe', title: "Export Globally", description: "Download high-quality A4 PDFs compatible with global recruitment standards." }
    ];

    authCtrl.handleAuth = async () => {
        $timeout(() => {
            authCtrl.loading = true;
            authCtrl.error = null;
        });

        try {
            const { error } = authCtrl.isSignUp 
                ? await supabase.auth.signUp({ email: authCtrl.email, password: authCtrl.password })
                : await supabase.auth.signInWithPassword({ email: authCtrl.email, password: authCtrl.password });

            if (error) throw error;
            if (authCtrl.isSignUp) alert('Check your email for the confirmation link!');
        } catch (err: any) {
            $timeout(() => {
                authCtrl.error = err.message;
            });
        } finally {
            $timeout(() => {
                authCtrl.loading = false;
            });
        }
    };
}]);

// Main Controller
app.controller('ResumeController', ['AuthService', '$scope', '$timeout', function(AuthService, $scope, $timeout) {
    const ctrl = this;
    ctrl.auth = AuthService;
    ctrl.resumeData = JSON.parse(JSON.stringify(INITIAL_DATA));
    ctrl.activeStep = 1;
    ctrl.isDarkMode = false;
    ctrl.isSettingsOpen = false;
    ctrl.isTemplateGalleryOpen = false;
    ctrl.isFullScreenPreview = false;
    ctrl.selectedTemplate = 'modern-sidebar';
    ctrl.saveStatus = 'idle';

    ctrl.toggleFullscreen = () => {
        ctrl.isFullScreenPreview = !ctrl.isFullScreenPreview;
    };

    ctrl.steps = [
        { icon: 'user', label: 'Contact', step: 1 },
        { icon: 'graduation-cap', label: 'Education', step: 2 },
        { icon: 'briefcase', label: 'Experience', step: 3 },
        { icon: 'brain-circuit', label: 'Skills', step: 4 },
        { icon: 'file-text', label: 'Summary', step: 5 },
    ];

    ctrl.toggleTheme = () => {
        ctrl.isDarkMode = !ctrl.isDarkMode;
    };

    ctrl.addExperience = () => {
        ctrl.resumeData.experiences.push({
            id: Math.random().toString(36).substr(2, 9),
            jobTitle: "", employer: "", city: "", startDate: "", endDate: "", description: ""
        });
    };

    ctrl.removeExperience = (id: string) => {
        ctrl.resumeData.experiences = ctrl.resumeData.experiences.filter((e: any) => e.id !== id);
    };

    ctrl.addEducation = () => {
        ctrl.resumeData.education.push({
            id: Math.random().toString(36).substr(2, 9),
            degree: "", school: "", city: "", startDate: "", endDate: ""
        });
    };

    ctrl.removeEducation = (id: string) => {
        ctrl.resumeData.education = ctrl.resumeData.education.filter((e: any) => e.id !== id);
    };

    ctrl.addSkillGroup = () => {
        ctrl.resumeData.skills.push({
            id: Math.random().toString(36).substr(2, 9), category: "", items: ""
        });
    };

    ctrl.removeSkillGroup = (id: string) => {
        ctrl.resumeData.skills = ctrl.resumeData.skills.filter((s: any) => s.id !== id);
    };

    ctrl.handleExportPDF = async () => {
        const element = document.getElementById('resume-preview-root');
        if (!element) return;

        $timeout(() => {
            ctrl.saveStatus = 'saving';
        });

        const fullName = ctrl.resumeData.personalInfo.fullName || "professional";
        const fileName = `resume_${fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`;

        const opt = {
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                windowWidth: 1200,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc: Document) => {
                    const el = clonedDoc.getElementById('resume-preview-root');
                    if (el) {
                        el.style.width = '210mm';
                        el.style.minHeight = '297mm';
                        el.style.margin = '0';
                        el.style.boxShadow = 'none';
                        el.style.borderRadius = '0';
                        el.style.display = 'flex';
                        el.style.flexDirection = el.getAttribute('ng-class')?.includes('modern-sidebar') ? 'row' : 'column';
                    }
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            // @ts-ignore
            await html2pdf().set(opt).from(element).save();
            $timeout(() => {
                ctrl.saveStatus = 'success';
            });
        } catch (err) {
            console.error(err);
            $timeout(() => {
                ctrl.saveStatus = 'error';
            });
        } finally {
            $timeout(() => { 
                ctrl.saveStatus = 'idle'; 
            }, 3000);
        }
    };
}]);

// Resume Preview Component
app.component('resumePreview', {
    bindings: {
        content: '<',
        template: '<'
    },
    templateUrl: '/src/templates/resume-preview.html'
});

// Run initial check
app.run(['AuthService', (AuthService: any) => {
    AuthService.getSession();
    createIcons({ icons: icons });
}]);

// Manual bootstrap removed as ng-app is now in index.html
// angular.element(document).ready(() => {
//     angular.bootstrap(document, ['resumeApp']);
// });
