/**
 * 网站导航 - 主JavaScript文件
 * 包含主题切换、搜索引擎切换、紧凑模式等功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. 主题切换功能
    // ============================================
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        // 获取当前主题
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // 更新按钮状态
        updateThemeButton(themeToggle, currentTheme);
        
        // 点击切换主题
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // 应用新主题
            applyTheme(newTheme);
            
            // 更新按钮状态
            updateThemeButton(this, newTheme);
            
            // 保存到localStorage
            localStorage.setItem('theme', newTheme);
            
            // 添加切换动画
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // 键盘支持
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // 应用主题
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // 更新主题按钮
    function updateThemeButton(button, theme) {
        button.setAttribute('aria-pressed', theme === 'dark');
        button.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        button.setAttribute('title', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    }
    
    // ============================================
    // 2. 搜索引擎切换功能
    // ============================================
    function initSearchEngine() {
        const engineBtns = document.querySelectorAll('.engine-btn');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (!engineBtns.length || !searchBtn) return;
        
        let currentEngine = 'google';
        const engineUrls = {
            google: 'https://www.google.com/search?q=',
            bing: 'https://www.bing.com/search?q=',
            baidu: 'https://www.baidu.com/s?wd='
        };
        
        const placeholders = {
            google: '在 Google 中搜索...',
            bing: '在 Bing 中搜索...',
            baidu: '在百度中搜索...'
        };
        
        // 初始化
        if (searchInput) {
            searchInput.placeholder = placeholders[currentEngine];
        }
        
        // 引擎按钮点击事件
        engineBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const engine = this.dataset.engine;
                
                // 更新按钮状态
                engineBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // 更新当前引擎
                currentEngine = engine;
                
                // 更新搜索框占位符
                if (searchInput) {
                    searchInput.placeholder = placeholders[engine] || '输入关键词搜索...';
                    searchInput.focus();
                }
                
                // 添加点击效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
            
            // 键盘导航支持
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextBtn = this.nextElementSibling || engineBtns[0];
                    nextBtn.focus();
                    nextBtn.click();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevBtn = this.previousElementSibling || engineBtns[engineBtns.length - 1];
                    prevBtn.focus();
                    prevBtn.click();
                }
            });
        });
        
        // 搜索功能
        function performSearch() {
            if (!searchInput) return;
            
            const query = searchInput.value.trim();
            if (query) {
                const searchUrl = engineUrls[currentEngine] + encodeURIComponent(query);
                window.open(searchUrl, '_blank', 'noopener,noreferrer');
                
                // 搜索后清空输入框
                searchInput.value = '';
                
                // 添加搜索反馈
                searchBtn.innerHTML = '✓ 已搜索';
                searchBtn.style.backgroundColor = 'var(--success-color)';
                setTimeout(() => {
                    searchBtn.innerHTML = '🔍 搜索';
                    searchBtn.style.backgroundColor = '';
                }, 1500);
            } else {
                // 输入框为空时聚焦
                searchInput.focus();
                searchInput.style.boxShadow = '0 0 0 2px var(--warning-color)';
                setTimeout(() => {
                    searchInput.style.boxShadow = '';
                }, 1000);
            }
        }
        
        // 搜索按钮事件
        searchBtn.addEventListener('click', performSearch);
        
        // 回车键搜索
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    }
    
    // ============================================
    // 3. 紧凑模式切换
    // ============================================
    function initCompactMode() {
        const compactToggle = document.getElementById('compactToggle');
        if (!compactToggle) return;
        
        // 加载保存的设置
        const savedCompactMode = localStorage.getItem('compactMode') === 'true';
        if (savedCompactMode) {
            document.body.classList.add('compact-mode');
            compactToggle.innerHTML = '📖';
            compactToggle.setAttribute('title', '切换到标准模式');
        }
        
        // 切换事件
        compactToggle.addEventListener('click', function() {
            const isCompact = document.body.classList.toggle('compact-mode');
            
            // 更新按钮状态
            this.innerHTML = isCompact ? '📖' : '📐';
            this.setAttribute('title', isCompact ? '切换到标准模式' : '切换到紧凑模式');
            
            // 保存设置
            localStorage.setItem('compactMode', isCompact ? 'true' : 'false');
            
            // 添加切换效果
            this.style.transform = 'rotate(90deg) scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // 键盘支持
        compactToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // ============================================
    // 4. 返回顶部功能
    // ============================================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // 5. 网站计数
    // ============================================
    function initSiteCount() {
        const siteCountEl = document.getElementById('siteCount');
        if (!siteCountEl) return;
        
        // 计算网站卡片数量
        const siteCards = document.querySelectorAll('.card');
        siteCountEl.textContent = siteCards.length;
    }
    
    // ============================================
    // 6. 无障碍优化
    // ============================================
    function initAccessibility() {
        // 添加焦点样式管理
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--primary-color)';
                this.style.outlineOffset = '2px';
                this.style.zIndex = '10';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
                this.style.zIndex = '';
            });
        });
        
       
        
        // 外部链接安全处理
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="'+window.location.hostname+'"])');
        externalLinks.forEach(link => {
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 不再添加外部链接箭头标识（UI 保持简洁）
        });
    }
    
    // ============================================
    // 7. 页面加载效果
    // ============================================
    function initPageLoadEffects() {
        // 添加加载完成的类，用于CSS动画
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        // 卡片入场动画
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 50)); // 错开动画时间
        });
    }
    
    // ============================================
    // 8. 初始化所有功能
    // ============================================
    function initAll() {
        initThemeToggle();
        initSearchEngine();
        initCompactMode();
        initBackToTop();
        initSiteCount();
        initAccessibility();
        initPageLoadEffects();
        
        console.log('🔗 网站导航已加载完成！');
    }
    
    // 执行初始化
    initAll();
});