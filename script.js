// script.js
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // Navigation & URL Routing
    // -----------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('mainSidebar');
    const pageTitle = document.getElementById('pageTitle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const viewSections = document.querySelectorAll('.view-section');
    const messageInput = document.getElementById('messageInput');
    
    // Parse URL query parameters to determine which page to show
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page') || 'dashboard';
    const currentAction = urlParams.get('action');

    // Mobile Sidebar Toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    function switchToView(targetId, title) {
        pageTitle.innerText = title;
        viewSections.forEach(section => section.style.display = 'none');
        
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.style.display = 'block';
            
            if (targetId === 'view-chat') {
                const chatArea = document.getElementById('chatArea');
                if(chatArea) chatArea.scrollTop = chatArea.scrollHeight;
            }
            if (targetId === 'view-live-chat') {
                const liveChatArea = document.getElementById('liveChatArea');
                if(liveChatArea) liveChatArea.scrollTop = liveChatArea.scrollHeight;
            }
        }
    }

    // Set Active State and View based on URL
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('page=')[1]?.split('&')[0];
        
        if (linkPage === currentPage) {
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            const title = link.innerText.trim();
            switchToView(targetId, title);
        }
    });

    // Special case for Profile which has no sidebar link
    if (currentPage === 'profile') {
        switchToView('view-profile', 'My Profile');
    }

    // Special action parameter
    if (currentPage === 'chat' && currentAction === 'troubleshoot') {
        messageInput.value = "I need help troubleshooting an issue.";
        messageInput.focus();
    }

    // -----------------------------------------
    // Data Fetching & Rendering
    // -----------------------------------------
    if (currentPage === 'dashboard' || currentPage === 'equipment') fetchEquipment();
    if (currentPage === 'dashboard' || currentPage === 'maintenance') fetchMaintenance();
    if (currentPage === 'dashboard' || currentPage === 'alerts') fetchAlerts();
    if (currentPage === 'chat') fetchChatHistory();
    if (currentPage === 'safety') fetchSafety();

    async function fetchEquipment() {
        try {
            const res = await fetch(`${API_BASE_URL}/equipment`);
            const data = await res.json();
            if (data.success) {
                renderEquipment(data.data);
                if(document.getElementById('statTotalEquipment')) {
                    document.getElementById('statTotalEquipment').innerText = data.data.length;
                }
            }
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    }

    function renderEquipment(equipmentList) {
        const grid = document.getElementById('equipmentGrid');
        if (!grid) return;
        grid.innerHTML = '';
        equipmentList.forEach((eq, index) => {
            let statusClass = 'online';
            if (eq.status === 'Needs Attention') statusClass = 'warning';
            if (eq.status === 'Down / Alert') statusClass = 'offline';

            let iconClass = 'fa-gears';
            if (eq.type === 'Transport') iconClass = 'fa-truck-fast';
            if (eq.type === 'Utility') iconClass = 'fa-fan';
            if (eq.name.includes('Boiler')) iconClass = 'fa-fire';
            if (eq.type === 'Power') iconClass = 'fa-bolt';

            const delay = 0.1 + (index * 0.1);
            
            const card = document.createElement('div');
            card.className = 'card eq-card';
            card.style.animationDelay = `${delay}s`;
            card.innerHTML = `
                <div class="eq-status ${statusClass}"></div>
                <i class="fa-solid ${iconClass} eq-icon"></i>
                <h3>${eq.name}</h3>
                <p>Status: ${eq.status}</p>
                <p class="eq-meta">Last Maint: ${new Date(eq.lastMaintenanceDate).toLocaleDateString()}</p>
            `;
            grid.appendChild(card);
        });
    }

    async function fetchMaintenance() {
        try {
            const res = await fetch(`${API_BASE_URL}/maintenance`);
            const data = await res.json();
            if (data.success) {
                renderMaintenance(data.data);
                
                const pending = data.data.filter(t => t.status === 'Pending').length;
                const scheduled = data.data.filter(t => t.status === 'Scheduled').length;
                const completedStr = document.getElementById('statCompletedTasks') ? "452" : null;
                
                if (document.getElementById('statPendingTasks')) {
                    document.getElementById('statPendingTasks').innerText = pending + scheduled;
                }
                if (document.getElementById('statCompletedTasks')) {
                    document.getElementById('statCompletedTasks').innerText = completedStr;
                }
            }
        } catch (error) {
            console.error('Error fetching maintenance:', error);
        }
    }

    function renderMaintenance(tasks) {
        const tbody = document.getElementById('maintenanceTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        tasks.forEach(task => {
            let badgeClass = 'badge-info';
            if (task.status === 'Pending') badgeClass = 'badge-warning';
            if (task.status === 'Completed') badgeClass = 'badge-success';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#MT-${task.id ? task.id.substring(0, 4) : Math.floor(Math.random() * 9000 + 1000)}</td>
                <td>${task.equipmentName}</td>
                <td>${task.maintenanceType}</td>
                <td>${new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                <td><span class="badge ${badgeClass}">${task.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    async function fetchAlerts() {
        try {
            const res = await fetch(`${API_BASE_URL}/alerts`);
            const data = await res.json();
            if (data.success) {
                renderAlerts(data.data);
                if (document.getElementById('statActiveAlerts')) {
                    document.getElementById('statActiveAlerts').innerText = data.data.filter(a => a.status === 'Active').length;
                }
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    }

    function renderAlerts(alerts) {
        const list = document.getElementById('alertsList');
        if (!list) return;
        list.innerHTML = '';
        alerts.forEach(alert => {
            let priorityClass = 'medium-priority';
            let iconClass = 'fa-wave-square';
            
            if (alert.severity === 'Critical') {
                priorityClass = 'high-priority';
                iconClass = 'fa-temperature-arrow-up';
            } else if (alert.title.includes('Oil')) {
                iconClass = 'fa-oil-can';
            }

            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${priorityClass}`;
            alertDiv.innerHTML = `
                <div class="alert-icon"><i class="fa-solid ${iconClass}"></i></div>
                <div class="alert-details">
                    <h4>${alert.title}</h4>
                    <p>${alert.description}</p>
                </div>
                <div class="alert-time">Just now</div>
            `;
            list.appendChild(alertDiv);
        });
    }

    async function fetchSafety() {
        try {
            const res = await fetch(`${API_BASE_URL}/safety`);
            const data = await res.json();
            if (data.success) {
                const list = document.getElementById('safetyList');
                if (!list) return;
                list.innerHTML = '';
                data.data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'message-content';
                    div.style.backgroundColor = 'var(--card-bg)';
                    div.innerHTML = `<h3 style="color: var(--primary-color); margin-bottom: 8px;">${item.title}</h3><p>${item.guidelines}</p>`;
                    list.appendChild(div);
                });
            }
        } catch (error) {
            console.error('Error fetching safety data:', error);
        }
    }

    // -----------------------------------------
    // AI Chatbot Implementation
    // -----------------------------------------
    const chatArea = document.getElementById('chatArea');
    const sendBtn = document.getElementById('sendBtn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const quickActionsContainer = document.getElementById('quickActions');

    async function fetchChatHistory() {
        try {
            const res = await fetch(`${API_BASE_URL}/chat`);
            const data = await res.json();
            
            if (!chatArea) return;

            Array.from(chatArea.children).forEach(child => {
                if (child.id !== 'quickActions') {
                    chatArea.removeChild(child);
                }
            });

            if (data.success && data.data.length > 0) {
                data.data.forEach(chat => {
                    addMessageToUI(chat.message, chat.sender === 'User', chatArea, quickActionsContainer);
                });
            } else {
                addMessageToUI("Hello! I am your AI Maintenance Bot. How can I assist you today?", false, chatArea, quickActionsContainer);
            }
        } catch (error) {
            console.error('Error fetching AI chat history:', error);
        }
    }

    function addMessageToUI(text, isUser = false, container, insertBeforeElement = null, senderName = '') {
        if (!container) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : (senderName ? '<i class="fa-solid fa-users"></i>' : '<i class="fa-solid fa-robot"></i>');
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        if (senderName) {
            contentDiv.style.borderColor = 'var(--accent-color)';
            contentDiv.innerHTML = `<span style="display:block; font-size: 0.75rem; color: var(--accent-color); margin-bottom: 4px; font-weight: bold;">${senderName}</span><p>${text}</p>`;
        } else {
            contentDiv.innerHTML = `<p>${text}</p>`;
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        
        if (insertBeforeElement) {
            container.insertBefore(messageDiv, insertBeforeElement);
        } else {
            container.appendChild(messageDiv);
        }
        
        container.scrollTop = container.scrollHeight;
    }

    const handleSendAI = async () => {
        const text = messageInput.value.trim();
        if (text) {
            addMessageToUI(text, true, chatArea, quickActionsContainer);
            messageInput.value = '';
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.innerHTML = `
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content" style="padding: 12px 16px;">
                    <i class="fa-solid fa-ellipsis" style="color: var(--text-secondary); animation: pulse 1s infinite;"></i>
                </div>
            `;
            
            if (quickActionsContainer) {
                chatArea.insertBefore(typingDiv, quickActionsContainer);
            } else {
                chatArea.appendChild(typingDiv);
            }
            chatArea.scrollTop = chatArea.scrollHeight;

            try {
                const res = await fetch(`${API_BASE_URL}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                
                const data = await res.json();
                chatArea.removeChild(typingDiv);
                
                if (data.success) {
                    addMessageToUI(data.data.botResponse.message, false, chatArea, quickActionsContainer);
                } else {
                    addMessageToUI("Error connecting to server.", false, chatArea, quickActionsContainer);
                }
            } catch (error) {
                chatArea.removeChild(typingDiv);
                addMessageToUI("Network error occurred.", false, chatArea, quickActionsContainer);
                console.error(error);
            }
        }
    };

    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', handleSendAI);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendAI();
        });
    }

    if (quickBtns.length > 0) {
        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                messageInput.value = btn.innerText;
                handleSendAI();
            });
        });
    }

    // -----------------------------------------
    // Real-Time Socket.io Implementation
    // -----------------------------------------
    let socket;
    try {
        socket = io(API_BASE_URL.replace('/api', ''));
    } catch (e) {
        console.warn('Socket.io not found or server offline.', e);
    }

    const liveChatArea = document.getElementById('liveChatArea');
    const liveMessageInput = document.getElementById('liveMessageInput');
    const liveSendBtn = document.getElementById('liveSendBtn');

    const myUsername = 'Tech_' + Math.floor(Math.random() * 1000);

    if (socket) {
        socket.on('receive_live_message', (data) => {
            addMessageToUI(data.text, false, liveChatArea, null, data.senderName);
        });

        const handleLiveSend = () => {
            const text = liveMessageInput.value.trim();
            if (text) {
                addMessageToUI(text, true, liveChatArea);
                liveMessageInput.value = '';
                
                socket.emit('send_live_message', {
                    text: text,
                    senderName: myUsername
                });
            }
        };

        if (liveSendBtn && liveMessageInput) {
            liveSendBtn.addEventListener('click', handleLiveSend);
            liveMessageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleLiveSend();
            });
        }
    }

});