// Community Bridge Platform JavaScript
class CommunityBridge {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.opportunities = [];
        this.programs = [];
        this.reports = [];
        this.users = [];
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.loadMockData();
        this.checkAuthStatus();
        this.updateStats();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Authentication forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Opportunity form
        document.getElementById('opportunity-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateOpportunity();
        });

        // Program form
        document.getElementById('program-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateProgram();
        });

        // Report form
        document.getElementById('report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmitReport();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // Stakeholder cards
        document.querySelectorAll('.stakeholder-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const role = e.currentTarget.dataset.role;
                this.showRoleInfo(role);
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterProgramsByCategory(category);
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    loadMockData() {
        // Mock users
        this.users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'youth',
                location: 'Lagos, Nigeria',
                phone: '+234-123-456-7890'
            },
            {
                id: 2,
                name: 'TechCorp Ltd',
                email: 'hr@techcorp.com',
                role: 'company',
                location: 'Abuja, Nigeria',
                phone: '+234-987-654-3210'
            },
            {
                id: 3,
                name: 'Mary Johnson',
                email: 'mary@farmersunion.org',
                role: 'farmer',
                location: 'Kaduna, Nigeria',
                phone: '+234-555-123-456'
            },
            {
                id: 4,
                name: 'Hope Foundation',
                email: 'info@hopefoundation.org',
                role: 'ngo',
                location: 'Port Harcourt, Nigeria',
                phone: '+234-777-888-999'
            },
            {
                id: 5,
                name: 'Dr. Sarah Wilson',
                email: 'sarah@gov.ng',
                role: 'government',
                location: 'Abuja, Nigeria',
                phone: '+234-111-222-333'
            }
        ];

        // Mock opportunities
        this.opportunities = [
            {
                id: 1,
                title: 'Frontend Developer',
                type: 'jobs',
                company: 'TechCorp Ltd',
                description: 'We are looking for a skilled Frontend Developer to join our team and work on exciting projects.',
                location: 'Lagos, Nigeria',
                salary: '₦300,000 - ₦500,000',
                requirements: 'React, JavaScript, CSS, HTML',
                postedBy: 2,
                createdAt: new Date('2024-01-15')
            },
            {
                id: 2,
                title: 'Digital Marketing Training',
                type: 'skills',
                company: 'Hope Foundation',
                description: 'Free 6-week digital marketing training program for youth aged 18-35.',
                location: 'Online',
                salary: 'Free',
                requirements: 'Basic computer skills',
                postedBy: 4,
                createdAt: new Date('2024-01-10')
            },
            {
                id: 3,
                title: 'Remote Content Writer',
                type: 'remote',
                company: 'Global Media Inc',
                description: 'Work from home as a content writer for our international clients.',
                location: 'Remote',
                salary: '₦150,000 - ₦250,000',
                requirements: 'Excellent English, Portfolio',
                postedBy: 2,
                createdAt: new Date('2024-01-12')
            },
            {
                id: 4,
                title: 'Youth Entrepreneurship Program',
                type: 'empowerment',
                company: 'Ministry of Youth Development',
                description: 'Government-sponsored entrepreneurship program with funding opportunities.',
                location: 'Nationwide',
                salary: 'Funding up to ₦2,000,000',
                requirements: 'Age 18-35, Business plan',
                postedBy: 5,
                createdAt: new Date('2024-01-08')
            }
        ];

        // Mock programs
        this.programs = [
            {
                id: 1,
                title: 'Agricultural Modernization Initiative',
                category: 'agriculture',
                organizer: 'Ministry of Agriculture',
                description: 'Training farmers on modern agricultural techniques and providing equipment support.',
                duration: '6 months',
                participants: 500,
                benefits: 'Free equipment, training, market access',
                createdBy: 5,
                createdAt: new Date('2024-01-05')
            },
            {
                id: 2,
                title: 'Youth Skills Development Program',
                category: 'youth',
                organizer: 'Hope Foundation',
                description: 'Comprehensive skills training in technology, entrepreneurship, and leadership.',
                duration: '3 months',
                participants: 200,
                benefits: 'Certification, job placement, mentorship',
                createdBy: 4,
                createdAt: new Date('2024-01-07')
            },
            {
                id: 3,
                title: 'Small Business Support Initiative',
                category: 'business',
                organizer: 'Bank of Industry',
                description: 'Financial support and business development services for small businesses.',
                duration: '12 months',
                participants: 100,
                benefits: 'Loans, mentorship, market access',
                createdBy: 5,
                createdAt: new Date('2024-01-03')
            }
        ];

        // Mock reports
        this.reports = [
            {
                id: 1,
                type: 'corruption',
                title: 'Misappropriation of Funds',
                description: 'Suspected misuse of community development funds in local government area.',
                location: 'Ikeja LGA, Lagos',
                status: 'pending',
                anonymous: false,
                reportedBy: 1,
                createdAt: new Date('2024-01-14')
            },
            {
                id: 2,
                type: 'service-failure',
                title: 'Poor Road Conditions',
                description: 'Major road in community has been in poor condition for over 2 years.',
                location: 'Victoria Island, Lagos',
                status: 'resolved',
                anonymous: true,
                reportedBy: null,
                createdAt: new Date('2024-01-10')
            }
        ];

        // Store in localStorage
        localStorage.setItem('cb_users', JSON.stringify(this.users));
        localStorage.setItem('cb_opportunities', JSON.stringify(this.opportunities));
        localStorage.setItem('cb_programs', JSON.stringify(this.programs));
        localStorage.setItem('cb_reports', JSON.stringify(this.reports));
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('cb_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.currentUser.role;
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${section}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        switch (section) {
            case 'opportunities':
                this.loadOpportunities();
                break;
            case 'programs':
                this.loadPrograms();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Find user
        const user = this.users.find(u => u.email === email);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('cb_currentUser', JSON.stringify(this.currentUser));
            
            this.updateUIForLoggedInUser();
            this.hideModal('auth-modal');
            this.showSuccessModal('Login Successful!', `Welcome back, ${user.name}!`);
            
            // Reset form
            document.getElementById('login-form').reset();
        } else {
            this.showNotification('Invalid email or password. Please try again.', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const role = document.getElementById('register-role').value;
        const location = document.getElementById('register-location').value;
        const password = document.getElementById('register-password').value;

        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);

        if (existingUser) {
            this.showNotification('User with this email already exists.', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            phone,
            role,
            location,
            registeredAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('cb_users', JSON.stringify(this.users));

        // Auto-login
        this.currentUser = newUser;
        localStorage.setItem('cb_currentUser', JSON.stringify(this.currentUser));
        
        this.updateUIForLoggedInUser();
        this.hideModal('register-modal');
        this.updateStats();
        this.showSuccessModal('Registration Successful!', `Welcome to Community Bridge, ${name}!`);
        
        // Reset form
        document.getElementById('register-form').reset();
    }

    handleCreateOpportunity() {
        if (!this.currentUser) {
            this.showNotification('Please login to post opportunities.', 'error');
            return;
        }

        const title = document.getElementById('opp-title').value;
        const type = document.getElementById('opp-type').value;
        const description = document.getElementById('opp-description').value;
        const location = document.getElementById('opp-location').value;
        const salary = document.getElementById('opp-salary').value;
        const requirements = document.getElementById('opp-requirements').value;

        const newOpportunity = {
            id: this.opportunities.length + 1,
            title,
            type,
            company: this.currentUser.name,
            description,
            location,
            salary,
            requirements,
            postedBy: this.currentUser.id,
            createdAt: new Date()
        };

        this.opportunities.push(newOpportunity);
        localStorage.setItem('cb_opportunities', JSON.stringify(this.opportunities));

        this.hideModal('post-opportunity-modal');
        this.showSuccessModal('Opportunity Posted!', 'Your opportunity has been posted successfully.');
        this.loadOpportunities();
        
        // Reset form
        document.getElementById('opportunity-form').reset();
    }

    handleCreateProgram() {
        if (!this.currentUser) {
            this.showNotification('Please login to create programs.', 'error');
            return;
        }

        const title = document.getElementById('program-title').value;
        const category = document.getElementById('program-category').value;
        const description = document.getElementById('program-description').value;
        const duration = document.getElementById('program-duration').value;
        const participants = document.getElementById('program-participants').value;
        const benefits = document.getElementById('program-benefits').value;

        const newProgram = {
            id: this.programs.length + 1,
            title,
            category,
            organizer: this.currentUser.name,
            description,
            duration,
            participants: parseInt(participants),
            benefits,
            createdBy: this.currentUser.id,
            createdAt: new Date()
        };

        this.programs.push(newProgram);
        localStorage.setItem('cb_programs', JSON.stringify(this.programs));

        this.hideModal('create-program-modal');
        this.showSuccessModal('Program Created!', 'Your program has been created successfully.');
        this.loadPrograms();
        
        // Reset form
        document.getElementById('program-form').reset();
    }

    handleSubmitReport() {
        if (!this.currentUser) {
            this.showNotification('Please login to submit reports.', 'error');
            return;
        }

        const type = document.getElementById('report-type').value;
        const title = document.getElementById('report-title').value;
        const description = document.getElementById('report-description').value;
        const location = document.getElementById('report-location').value;
        const evidence = document.getElementById('report-evidence').value;
        const anonymous = document.getElementById('report-anonymous').checked;

        const newReport = {
            id: this.reports.length + 1,
            type,
            title,
            description,
            location,
            evidence,
            status: 'pending',
            anonymous,
            reportedBy: anonymous ? null : this.currentUser.id,
            createdAt: new Date()
        };

        this.reports.push(newReport);
        localStorage.setItem('cb_reports', JSON.stringify(this.reports));

        this.hideModal('report-modal');
        this.showSuccessModal('Report Submitted!', 'Your report has been submitted and will be reviewed.');
        this.loadReports();
        
        // Reset form
        document.getElementById('report-form').reset();
    }

    loadOpportunities(filter = 'all') {
        const opportunitiesList = document.getElementById('opportunities-list');
        opportunitiesList.innerHTML = '';

        let filteredOpportunities = this.opportunities;
        if (filter !== 'all') {
            filteredOpportunities = this.opportunities.filter(opp => opp.type === filter);
        }

        if (filteredOpportunities.length === 0) {
            opportunitiesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Opportunities Found</h3>
                    <p>No opportunities match your current filter.</p>
                </div>
            `;
            return;
        }

        filteredOpportunities.forEach(opportunity => {
            const opportunityCard = this.createOpportunityCard(opportunity);
            opportunitiesList.appendChild(opportunityCard);
        });
    }

    createOpportunityCard(opportunity) {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        
        card.innerHTML = `
            <div class="opportunity-header">
                <div class="opportunity-type ${opportunity.type}">${opportunity.type}</div>
                <h3 class="opportunity-title">${opportunity.title}</h3>
                <div class="opportunity-company">${opportunity.company}</div>
                <p class="opportunity-description">${opportunity.description}</p>
            </div>
            <div class="opportunity-footer">
                <div>
                    <div class="opportunity-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${opportunity.location}
                    </div>
                </div>
                <div class="opportunity-salary">${opportunity.salary}</div>
            </div>
        `;
        
        return card;
    }

    loadPrograms() {
        const programsList = document.getElementById('programs-list');
        programsList.innerHTML = '';

        if (this.programs.length === 0) {
            programsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No Programs Available</h3>
                    <p>No programs are currently available.</p>
                </div>
            `;
            return;
        }

        this.programs.forEach(program => {
            const programCard = this.createProgramCard(program);
            programsList.appendChild(programCard);
        });
    }

    createProgramCard(program) {
        const card = document.createElement('div');
        card.className = 'program-card';
        
        card.innerHTML = `
            <div class="program-header">
                <div class="program-category ${program.category}">${program.category}</div>
                <h3 class="program-title">${program.title}</h3>
                <div class="program-organizer">by ${program.organizer}</div>
                <p class="program-description">${program.description}</p>
            </div>
            <div class="program-footer">
                <div class="program-meta">
                    <span><i class="fas fa-clock"></i> ${program.duration}</span>
                    <span><i class="fas fa-users"></i> ${program.participants} participants</span>
                </div>
                <button class="btn btn-primary">Apply Now</button>
            </div>
        `;
        
        return card;
    }

    loadReports() {
        const reportsList = document.getElementById('reports-list');
        reportsList.innerHTML = '';

        if (this.reports.length === 0) {
            reportsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-flag"></i>
                    <h3>No Reports</h3>
                    <p>No reports have been submitted yet.</p>
                </div>
            `;
            return;
        }

        this.reports.forEach(report => {
            const reportCard = this.createReportCard(report);
            reportsList.appendChild(reportCard);
        });
    }

    createReportCard(report) {
        const card = document.createElement('div');
        card.className = 'report-card';
        
        const reporter = report.anonymous ? 'Anonymous' : 
            this.users.find(u => u.id === report.reportedBy)?.name || 'Unknown';
        
        card.innerHTML = `
            <div class="report-header">
                <div class="report-type ${report.type}">${report.type}</div>
                <div class="report-status ${report.status}">${report.status}</div>
            </div>
            <h3 class="report-title">${report.title}</h3>
            <p class="report-description">${report.description}</p>
            <div class="report-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${report.location}</span>
                <span><i class="fas fa-user"></i> ${reporter}</span>
                <span><i class="fas fa-calendar"></i> ${report.createdAt.toLocaleDateString()}</span>
            </div>
        `;
        
        return card;
    }

    loadDashboard() {
        if (!this.currentUser) {
            document.getElementById('dashboard-content').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user"></i>
                    <h3>Login Required</h3>
                    <p>Please login to view your dashboard.</p>
                    <button class="btn btn-primary" onclick="showAuthModal()">Login Now</button>
                </div>
            `;
            return;
        }

        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = '';

        // Role-specific dashboard content
        switch (this.currentUser.role) {
            case 'youth':
                this.loadYouthDashboard(dashboardContent);
                break;
            case 'company':
                this.loadCompanyDashboard(dashboardContent);
                break;
            case 'farmer':
                this.loadFarmerDashboard(dashboardContent);
                break;
            case 'ngo':
                this.loadNGODashboard(dashboardContent);
                break;
            case 'government':
                this.loadGovernmentDashboard(dashboardContent);
                break;
            case 'civil-servant':
                this.loadCivilServantDashboard(dashboardContent);
                break;
        }
    }

    loadYouthDashboard(container) {
        const myApplications = this.opportunities.filter(opp => 
            opp.type === 'jobs' || opp.type === 'skills' || opp.type === 'empowerment'
        ).length;

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>My Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Name</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Role</span>
                    <span class="dashboard-stat-value">${this.currentUser.role}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Opportunities</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Available Jobs</span>
                    <span class="dashboard-stat-value">${this.opportunities.filter(o => o.type === 'jobs').length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Skills Training</span>
                    <span class="dashboard-stat-value">${this.opportunities.filter(o => o.type === 'skills').length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Empowerment Programs</span>
                    <span class="dashboard-stat-value">${this.opportunities.filter(o => o.type === 'empowerment').length}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>My Activity</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Applications Submitted</span>
                    <span class="dashboard-stat-value">0</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Programs Enrolled</span>
                    <span class="dashboard-stat-value">0</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Reports Submitted</span>
                    <span class="dashboard-stat-value">${this.reports.filter(r => r.reportedBy === this.currentUser.id).length}</span>
                </div>
            </div>
        `;
    }

    loadCompanyDashboard(container) {
        const myOpportunities = this.opportunities.filter(opp => opp.postedBy === this.currentUser.id);

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Company Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Company Name</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Contact</span>
                    <span class="dashboard-stat-value">${this.currentUser.email}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Posted Opportunities</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Total Posted</span>
                    <span class="dashboard-stat-value">${myOpportunities.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Job Openings</span>
                    <span class="dashboard-stat-value">${myOpportunities.filter(o => o.type === 'jobs').length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Remote Positions</span>
                    <span class="dashboard-stat-value">${myOpportunities.filter(o => o.type === 'remote').length}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Recruitment Stats</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Applications Received</span>
                    <span class="dashboard-stat-value">0</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Interviews Scheduled</span>
                    <span class="dashboard-stat-value">0</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Hires Made</span>
                    <span class="dashboard-stat-value">0</span>
                </div>
            </div>
        `;
    }

    loadGovernmentDashboard(container) {
        const myPrograms = this.programs.filter(prog => prog.createdBy === this.currentUser.id);
        const pendingReports = this.reports.filter(r => r.status === 'pending');

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Government Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Official Name</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Department</span>
                    <span class="dashboard-stat-value">Community Development</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Programs Managed</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Total Programs</span>
                    <span class="dashboard-stat-value">${myPrograms.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Active Programs</span>
                    <span class="dashboard-stat-value">${myPrograms.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Total Beneficiaries</span>
                    <span class="dashboard-stat-value">${myPrograms.reduce((sum, p) => sum + p.participants, 0)}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Community Reports</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Pending Reports</span>
                    <span class="dashboard-stat-value">${pendingReports.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Resolved Reports</span>
                    <span class="dashboard-stat-value">${this.reports.filter(r => r.status === 'resolved').length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Response Rate</span>
                    <span class="dashboard-stat-value">87%</span>
                </div>
            </div>
        `;
    }

    loadNGODashboard(container) {
        const myPrograms = this.programs.filter(prog => prog.createdBy === this.currentUser.id);
        const myOpportunities = this.opportunities.filter(opp => opp.postedBy === this.currentUser.id);

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>NGO Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Organization</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Focus Area</span>
                    <span class="dashboard-stat-value">Community Empowerment</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Programs & Opportunities</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Programs Created</span>
                    <span class="dashboard-stat-value">${myPrograms.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Opportunities Posted</span>
                    <span class="dashboard-stat-value">${myOpportunities.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">People Reached</span>
                    <span class="dashboard-stat-value">${myPrograms.reduce((sum, p) => sum + p.participants, 0)}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Impact Metrics</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Lives Impacted</span>
                    <span class="dashboard-stat-value">1,250</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Communities Served</span>
                    <span class="dashboard-stat-value">15</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Success Rate</span>
                    <span class="dashboard-stat-value">92%</span>
                </div>
            </div>
        `;
    }

    loadFarmerDashboard(container) {
        const agriculturePrograms = this.programs.filter(p => p.category === 'agriculture');

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Farmer Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Name</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Farm Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Farming Experience</span>
                    <span class="dashboard-stat-value">15 years</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Available Programs</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Agricultural Programs</span>
                    <span class="dashboard-stat-value">${agriculturePrograms.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Enrolled Programs</span>
                    <span class="dashboard-stat-value">2</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Completed Training</span>
                    <span class="dashboard-stat-value">1</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Farm Statistics</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Farm Size</span>
                    <span class="dashboard-stat-value">5 hectares</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Crop Types</span>
                    <span class="dashboard-stat-value">Rice, Maize, Cassava</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Annual Yield</span>
                    <span class="dashboard-stat-value">12 tons</span>
                </div>
            </div>
        `;
    }

    loadCivilServantDashboard(container) {
        const myReports = this.reports.filter(r => r.reportedBy === this.currentUser.id);

        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Civil Servant Profile</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Name</span>
                    <span class="dashboard-stat-value">${this.currentUser.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Department</span>
                    <span class="dashboard-stat-value">Public Service</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Location</span>
                    <span class="dashboard-stat-value">${this.currentUser.location}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Reporting Activity</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Reports Submitted</span>
                    <span class="dashboard-stat-value">${myReports.length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Reports Resolved</span>
                    <span class="dashboard-stat-value">${myReports.filter(r => r.status === 'resolved').length}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Pending Reports</span>
                    <span class="dashboard-stat-value">${myReports.filter(r => r.status === 'pending').length}</span>
                </div>
            </div>
            <div class="dashboard-card">
                <h3>Service Monitoring</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Services Monitored</span>
                    <span class="dashboard-stat-value">25</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Issues Identified</span>
                    <span class="dashboard-stat-value">8</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Improvements Made</span>
                    <span class="dashboard-stat-value">6</span>
                </div>
            </div>
        `;
    }

    handleFilterChange(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Load filtered opportunities
        this.loadOpportunities(filter);
    }

    filterProgramsByCategory(category) {
        const programsList = document.getElementById('programs-list');
        programsList.innerHTML = '';

        const filteredPrograms = this.programs.filter(program => program.category === category);

        if (filteredPrograms.length === 0) {
            programsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No Programs Found</h3>
                    <p>No programs found in the ${category} category.</p>
                </div>
            `;
            return;
        }

        filteredPrograms.forEach(program => {
            const programCard = this.createProgramCard(program);
            programsList.appendChild(programCard);
        });
    }

    showRoleInfo(role) {
        const roleInfo = {
            youth: {
                title: 'Youth & Graduates',
                description: 'Access empowerment programs, skill acquisition, remote jobs, and career opportunities.',
                benefits: ['Skill Development Programs', 'Remote Job Opportunities', 'Career Guidance', 'Entrepreneurship Support']
            },
            company: {
                title: 'Companies',
                description: 'Find qualified workers, post job opportunities, and contribute to community development.',
                benefits: ['Talent Recruitment', 'Job Posting Platform', 'CSR Programs', 'Skills Partnership']
            },
            farmer: {
                title: 'Farmers',
                description: 'Access government programs, modern farming techniques, and market opportunities.',
                benefits: ['Agricultural Programs', 'Modern Techniques', 'Market Access', 'Financial Support']
            },
            ngo: {
                title: 'NGOs',
                description: 'Coordinate empowerment programs, provide support, and facilitate community development.',
                benefits: ['Empowerment Programs', 'Community Support', 'Capacity Building', 'Advocacy']
            },
            government: {
                title: 'Government',
                description: 'Implement policies, distribute resources, and receive community feedback.',
                benefits: ['Policy Implementation', 'Resource Distribution', 'Community Feedback', 'Public Services']
            },
            'civil-servant': {
                title: 'Civil Servants',
                description: 'Report irregularities, ensure transparency, and maintain public service standards.',
                benefits: ['Transparency Reports', 'Service Monitoring', 'Public Accountability', 'Ethical Standards']
            }
        };

        const info = roleInfo[role];
        if (info) {
            this.showSuccessModal(info.title, info.description);
        }
    }

    updateStats() {
        document.getElementById('total-users').textContent = this.users.length;
        document.getElementById('active-programs').textContent = this.programs.length;
        document.getElementById('jobs-created').textContent = this.opportunities.filter(o => o.type === 'jobs').length;
        document.getElementById('reports-resolved').textContent = this.reports.filter(r => r.status === 'resolved').length;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            padding: 1rem;
            max-width: 400px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        const color = type === 'error' ? 'var(--error-color)' : 
                     type === 'success' ? 'var(--success-color)' : 
                     'var(--primary-color)';
        
        notification.style.borderLeft = `4px solid ${color}`;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; font-size: 0.875rem;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 1.25rem; padding: 0;">&times;</button>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showSuccessModal(title, message) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').classList.add('active');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('cb_currentUser');
        
        document.getElementById('login-btn').style.display = 'inline-flex';
        document.getElementById('register-btn').style.display = 'inline-flex';
        document.getElementById('user-info').style.display = 'none';
        
        this.navigateToSection('home');
        this.showNotification('You have been logged out successfully.', 'info');
    }

    exportData() {
        if (!this.currentUser) {
            this.showNotification('Please login to export data.', 'error');
            return;
        }

        const exportData = {
            user: this.currentUser,
            opportunities: this.opportunities.filter(o => o.postedBy === this.currentUser.id),
            programs: this.programs.filter(p => p.createdBy === this.currentUser.id),
            reports: this.reports.filter(r => r.reportedBy === this.currentUser.id),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `community_bridge_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification('Data exported successfully!', 'success');
    }
}

// Global functions for HTML onclick handlers
function showAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('register-modal').classList.add('active');
}

function showPostOpportunityModal() {
    if (!app.currentUser) {
        app.showNotification('Please login to post opportunities.', 'error');
        return;
    }
    document.getElementById('post-opportunity-modal').classList.add('active');
}

function showCreateProgramModal() {
    if (!app.currentUser) {
        app.showNotification('Please login to create programs.', 'error');
        return;
    }
    document.getElementById('create-program-modal').classList.add('active');
}

function showReportModal() {
    if (!app.currentUser) {
        app.showNotification('Please login to submit reports.', 'error');
        return;
    }
    document.getElementById('report-modal').classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function logout() {
    app.logout();
}

function exportData() {
    app.exportData();
}

// Initialize the application
const app = new CommunityBridge();

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);