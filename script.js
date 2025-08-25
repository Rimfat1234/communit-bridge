// Community Bridge Platform JavaScript

class CommunityBridge {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('communityBridge_users') || '[]');
        this.opportunities = JSON.parse(localStorage.getItem('communityBridge_opportunities') || '[]');
        this.programs = JSON.parse(localStorage.getItem('communityBridge_programs') || '[]');
        this.reports = JSON.parse(localStorage.getItem('communityBridge_reports') || '[]');
        this.applications = JSON.parse(localStorage.getItem('communityBridge_applications') || '[]');
        
        this.init();
        this.loadSampleData();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.loadContent();
        
        // Check if user is logged in
        const savedUser = localStorage.getItem('communityBridge_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                const section = e.target.closest('section').id;
                this.filterContent(section, filter);
                
                // Update active tab
                e.target.parentElement.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('create-opportunity-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateOpportunity();
        });

        document.getElementById('create-program-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateProgram();
        });

        document.getElementById('report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmitReport();
        });

        // Mobile menu toggle
        document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });
    }

    loadSampleData() {
        if (this.users.length === 0) {
            // Sample users
            const sampleUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@youth.com',
                    phone: '+1234567890',
                    role: 'youth',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Tech Corp',
                    email: 'hr@techcorp.com',
                    phone: '+1234567891',
                    role: 'company',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Ministry of Youth',
                    email: 'admin@gov.com',
                    phone: '+1234567892',
                    role: 'government',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Hope Foundation',
                    email: 'contact@hope.org',
                    phone: '+1234567893',
                    role: 'ngo',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Samuel Farmer',
                    email: 'samuel@farm.com',
                    phone: '+1234567894',
                    role: 'farmer',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                },
                {
                    id: 6,
                    name: 'Civil Servant',
                    email: 'civil@service.gov',
                    phone: '+1234567895',
                    role: 'civil-servant',
                    password: 'password123',
                    joinDate: new Date().toISOString()
                }
            ];
            
            this.users = sampleUsers;
            localStorage.setItem('communityBridge_users', JSON.stringify(this.users));
        }

        if (this.opportunities.length === 0) {
            // Sample opportunities
            const sampleOpportunities = [
                {
                    id: 1,
                    title: 'Software Developer Position',
                    type: 'job',
                    description: 'Join our dynamic team as a software developer. Work on cutting-edge projects and grow your career.',
                    requirements: 'Bachelor\'s degree in Computer Science, 2+ years experience',
                    location: 'Lagos, Nigeria',
                    salary: '₦500,000 - ₦800,000',
                    deadline: '2024-02-15',
                    postedBy: 2,
                    postedDate: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 2,
                    title: 'Digital Marketing Training',
                    type: 'training',
                    description: 'Learn digital marketing skills including SEO, social media marketing, and content creation.',
                    requirements: 'Basic computer skills, internet access',
                    location: 'Online',
                    salary: 'Free',
                    deadline: '2024-02-20',
                    postedBy: 4,
                    postedDate: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 3,
                    title: 'Remote Content Writer',
                    type: 'remote',
                    description: 'Write engaging content for various clients. Flexible hours and competitive pay.',
                    requirements: 'Excellent writing skills, portfolio required',
                    location: 'Remote',
                    salary: '₦50,000 - ₦150,000',
                    deadline: '2024-02-25',
                    postedBy: 2,
                    postedDate: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 4,
                    title: 'Government Internship Program',
                    type: 'government-job',
                    description: 'Gain experience in public service through our comprehensive internship program.',
                    requirements: 'Recent graduate, Nigerian citizen',
                    location: 'Abuja, Nigeria',
                    salary: '₦100,000 monthly stipend',
                    deadline: '2024-03-01',
                    postedBy: 3,
                    postedDate: new Date().toISOString(),
                    status: 'active'
                }
            ];
            
            this.opportunities = sampleOpportunities;
            localStorage.setItem('communityBridge_opportunities', JSON.stringify(this.opportunities));
        }

        if (this.programs.length === 0) {
            // Sample programs
            const samplePrograms = [
                {
                    id: 1,
                    name: 'Youth Entrepreneurship Program',
                    category: 'empowerment',
                    description: 'Empower young entrepreneurs with business skills, mentorship, and seed funding.',
                    beneficiaries: 'Youth aged 18-35',
                    duration: '6 months',
                    budget: '₦50,000,000',
                    startDate: '2024-03-01',
                    createdBy: 3,
                    createdDate: new Date().toISOString(),
                    status: 'active',
                    participants: 150
                },
                {
                    id: 2,
                    name: 'Modern Farming Techniques',
                    category: 'agriculture',
                    description: 'Train farmers in modern agricultural techniques and provide access to improved seeds.',
                    beneficiaries: 'Small-scale farmers',
                    duration: '3 months',
                    budget: '₦30,000,000',
                    startDate: '2024-02-15',
                    createdBy: 3,
                    createdDate: new Date().toISOString(),
                    status: 'active',
                    participants: 200
                },
                {
                    id: 3,
                    name: 'Women Empowerment Initiative',
                    category: 'empowerment',
                    description: 'Provide skills training and microfinance support to women in rural communities.',
                    beneficiaries: 'Women in rural areas',
                    duration: '12 months',
                    budget: '₦75,000,000',
                    startDate: '2024-01-15',
                    createdBy: 4,
                    createdDate: new Date().toISOString(),
                    status: 'active',
                    participants: 300
                },
                {
                    id: 4,
                    name: 'Tech Skills for All',
                    category: 'business',
                    description: 'Corporate social responsibility program providing free tech training to underserved communities.',
                    beneficiaries: 'Youth and adults',
                    duration: '4 months',
                    budget: '₦25,000,000',
                    startDate: '2024-02-01',
                    createdBy: 2,
                    createdDate: new Date().toISOString(),
                    status: 'active',
                    participants: 100
                }
            ];
            
            this.programs = samplePrograms;
            localStorage.setItem('communityBridge_programs', JSON.stringify(this.programs));
        }

        if (this.reports.length === 0) {
            // Sample reports
            const sampleReports = [
                {
                    id: 1,
                    type: 'corruption',
                    subject: 'Misappropriation of Funds',
                    description: 'Observed irregularities in the allocation of youth empowerment funds.',
                    location: 'Lagos State Ministry',
                    date: '2024-01-15',
                    submittedBy: 6,
                    submittedDate: new Date().toISOString(),
                    status: 'pending',
                    anonymous: false
                },
                {
                    id: 2,
                    type: 'service-failure',
                    subject: 'Poor Road Conditions',
                    description: 'Major road in community has been in poor condition for months, affecting transportation.',
                    location: 'Ikeja, Lagos',
                    date: '2024-01-20',
                    submittedBy: 1,
                    submittedDate: new Date().toISOString(),
                    status: 'resolved',
                    anonymous: false
                },
                {
                    id: 3,
                    type: 'misconduct',
                    subject: 'Official Misconduct',
                    description: 'Government official demanding bribes for service delivery.',
                    location: 'Abuja',
                    date: '2024-01-25',
                    submittedBy: null,
                    submittedDate: new Date().toISOString(),
                    status: 'under-review',
                    anonymous: true
                }
            ];
            
            this.reports = sampleReports;
            localStorage.setItem('communityBridge_reports', JSON.stringify(this.reports));
        }
    }

    updateStats() {
        // Update hero stats
        document.getElementById('total-users').textContent = this.users.length;
        document.getElementById('total-opportunities').textContent = this.opportunities.length;
        document.getElementById('total-programs').textContent = this.programs.length;
        document.getElementById('total-reports').textContent = this.reports.length;

        // Update reports stats
        const resolvedReports = this.reports.filter(r => r.status === 'resolved').length;
        const pendingReports = this.reports.filter(r => r.status === 'pending').length;
        
        document.getElementById('reports-submitted').textContent = this.reports.length;
        document.getElementById('reports-resolved').textContent = resolvedReports;
        document.getElementById('reports-pending').textContent = pendingReports;

        // Update role-specific stats if user is logged in
        if (this.currentUser) {
            this.updateRoleStats();
        }
    }

    updateRoleStats() {
        const role = this.currentUser.role;
        
        switch (role) {
            case 'youth':
                document.getElementById('youth-jobs').textContent = 
                    this.opportunities.filter(o => o.type === 'job').length;
                document.getElementById('youth-training').textContent = 
                    this.opportunities.filter(o => o.type === 'training').length;
                document.getElementById('youth-remote').textContent = 
                    this.opportunities.filter(o => o.type === 'remote').length;
                document.getElementById('youth-empowerment').textContent = 
                    this.programs.filter(p => p.category === 'empowerment').length;
                break;
                
            case 'company':
                document.getElementById('company-candidates').textContent = 
                    this.users.filter(u => u.role === 'youth').length;
                document.getElementById('company-jobs').textContent = 
                    this.opportunities.filter(o => o.postedBy === this.currentUser.id).length;
                document.getElementById('company-csr').textContent = 
                    this.programs.filter(p => p.createdBy === this.currentUser.id).length;
                document.getElementById('company-applications').textContent = 
                    this.applications.filter(a => a.opportunityPostedBy === this.currentUser.id).length;
                break;
                
            case 'government':
                document.getElementById('gov-farmer-programs').textContent = 
                    this.programs.filter(p => p.category === 'agriculture').length;
                document.getElementById('gov-youth-programs').textContent = 
                    this.programs.filter(p => p.category === 'empowerment').length;
                document.getElementById('gov-reports').textContent = 
                    this.reports.filter(r => r.status === 'pending').length;
                document.getElementById('gov-jobs').textContent = 
                    this.opportunities.filter(o => o.type === 'government-job').length;
                break;
                
            case 'ngo':
                document.getElementById('ngo-empowerment').textContent = 
                    this.programs.filter(p => p.createdBy === this.currentUser.id && p.category === 'empowerment').length;
                document.getElementById('ngo-training').textContent = 
                    this.opportunities.filter(o => o.postedBy === this.currentUser.id && o.type === 'training').length;
                document.getElementById('ngo-beneficiaries').textContent = 
                    this.programs.filter(p => p.createdBy === this.currentUser.id)
                        .reduce((total, p) => total + (p.participants || 0), 0);
                document.getElementById('ngo-partnerships').textContent = 3; // Sample data
                break;
                
            case 'farmer':
                document.getElementById('farmer-programs').textContent = 
                    this.programs.filter(p => p.category === 'agriculture').length;
                document.getElementById('farmer-training').textContent = 
                    this.opportunities.filter(o => o.type === 'training').length;
                document.getElementById('farmer-financial').textContent = 
                    this.programs.filter(p => p.category === 'agriculture' || p.category === 'business').length;
                document.getElementById('farmer-stats').textContent = 2; // Sample enrolled programs
                break;
                
            case 'civil-servant':
                document.getElementById('civil-reports').textContent = 
                    this.reports.filter(r => r.submittedBy === this.currentUser.id).length;
                document.getElementById('civil-monitoring').textContent = 5; // Sample services
                document.getElementById('civil-transparency').textContent = 85; // Sample score
                document.getElementById('civil-pending').textContent = 
                    this.reports.filter(r => r.submittedBy === this.currentUser.id && r.status === 'pending').length;
                break;
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
        
        // Load section content
        this.loadSectionContent(sectionId);
    }

    loadSectionContent(sectionId) {
        switch (sectionId) {
            case 'opportunities':
                this.loadOpportunities();
                break;
            case 'programs':
                this.loadPrograms();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    loadContent() {
        this.loadOpportunities();
        this.loadPrograms();
        this.loadReports();
    }

    loadOpportunities(filter = 'all') {
        const grid = document.getElementById('opportunities-grid');
        let opportunities = this.opportunities;
        
        if (filter !== 'all') {
            opportunities = opportunities.filter(o => o.type === filter);
        }
        
        if (opportunities.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Opportunities Available</h3>
                    <p>Check back later for new opportunities.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = opportunities.map(opportunity => {
            const poster = this.users.find(u => u.id === opportunity.postedBy);
            return `
                <div class="opportunity-card fade-in">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${opportunity.title}</div>
                            <div class="card-type">${this.formatType(opportunity.type)}</div>
                        </div>
                    </div>
                    <div class="card-description">${opportunity.description}</div>
                    <div class="card-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${opportunity.location}</span>
                        <span><i class="fas fa-money-bill-wave"></i> ${opportunity.salary}</span>
                        <span><i class="fas fa-calendar"></i> Deadline: ${this.formatDate(opportunity.deadline)}</span>
                        <span><i class="fas fa-user"></i> ${poster ? poster.name : 'Unknown'}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="app.applyForOpportunity(${opportunity.id})">
                            <i class="fas fa-paper-plane"></i> Apply
                        </button>
                        <button class="btn btn-outline" onclick="app.viewOpportunityDetails(${opportunity.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadPrograms(filter = 'all') {
        const grid = document.getElementById('programs-grid');
        let programs = this.programs;
        
        if (filter !== 'all') {
            programs = programs.filter(p => p.category === filter);
        }
        
        if (programs.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Programs Available</h3>
                    <p>Check back later for new programs.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = programs.map(program => {
            const creator = this.users.find(u => u.id === program.createdBy);
            return `
                <div class="program-card fade-in">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${program.name}</div>
                            <div class="card-type">${this.formatType(program.category)}</div>
                        </div>
                    </div>
                    <div class="card-description">${program.description}</div>
                    <div class="card-meta">
                        <span><i class="fas fa-users"></i> ${program.beneficiaries}</span>
                        <span><i class="fas fa-clock"></i> ${program.duration}</span>
                        <span><i class="fas fa-calendar"></i> Starts: ${this.formatDate(program.startDate)}</span>
                        <span><i class="fas fa-user-tie"></i> ${creator ? creator.name : 'Unknown'}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="app.joinProgram(${program.id})">
                            <i class="fas fa-hand-paper"></i> Join Program
                        </button>
                        <button class="btn btn-outline" onclick="app.viewProgramDetails(${program.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadReports(filter = 'all') {
        const grid = document.getElementById('reports-grid');
        let reports = this.reports;
        
        // Only show public reports or user's own reports
        if (this.currentUser && this.currentUser.role !== 'government') {
            reports = reports.filter(r => !r.anonymous || r.submittedBy === this.currentUser.id);
        }
        
        if (reports.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-flag"></i>
                    <h3>No Reports Available</h3>
                    <p>Transparency reports will appear here.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = reports.map(report => {
            const submitter = report.anonymous ? null : this.users.find(u => u.id === report.submittedBy);
            return `
                <div class="report-card fade-in">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${report.subject}</div>
                            <div class="status-badge status-${report.status}">${this.formatStatus(report.status)}</div>
                        </div>
                    </div>
                    <div class="card-description">${report.description}</div>
                    <div class="card-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${report.location}</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(report.date)}</span>
                        <span><i class="fas fa-user"></i> ${report.anonymous ? 'Anonymous' : (submitter ? submitter.name : 'Unknown')}</span>
                        <span><i class="fas fa-tag"></i> ${this.formatType(report.type)}</span>
                    </div>
                    ${this.currentUser && this.currentUser.role === 'government' ? `
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="app.updateReportStatus(${report.id}, 'resolved')">
                                <i class="fas fa-check"></i> Mark Resolved
                            </button>
                            <button class="btn btn-outline" onclick="app.viewReportDetails(${report.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    filterContent(section, filter) {
        switch (section) {
            case 'opportunities':
                this.loadOpportunities(filter);
                break;
            case 'programs':
                this.loadPrograms(filter);
                break;
            case 'reports':
                this.loadReports(filter);
                break;
        }
    }

    // Authentication Methods
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('communityBridge_currentUser', JSON.stringify(user));
            this.showDashboard();
            this.hideAuthModal();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const role = document.getElementById('register-role').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validation
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showNotification('Email already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            phone,
            role,
            password,
            joinDate: new Date().toISOString()
        };
        
        this.users.push(newUser);
        localStorage.setItem('communityBridge_users', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('communityBridge_currentUser', JSON.stringify(newUser));
        
        this.showDashboard();
        this.hideAuthModal();
        this.showNotification('Registration successful!', 'success');
        this.updateStats();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('communityBridge_currentUser');
        this.showSection('home');
        this.showNotification('Logged out successfully', 'success');
        
        // Hide dashboard and show home
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
    }

       showDashboard() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update user info (check that currentUser exists first to avoid errors)
    if (this.currentUser) {
        document.getElementById('user-name').textContent = this.currentUser.name || "Unknown User";
        document.getElementById('user-role').textContent = this.formatRole(this.currentUser.role) || "No Role";
    }
}
