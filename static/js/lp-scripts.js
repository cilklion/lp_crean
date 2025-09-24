// LP Page JavaScript - Classical Vision Studio
// アコーディオン機能、スムーススクロール、フォームバリデーション

document.addEventListener('DOMContentLoaded', function() {
    // スムーススクロール
    initSmoothScroll();

    // アコーディオン機能
    initAccordions();

    // フォームバリデーション
    initFormValidation();

    // ナビゲーション背景変更
    initNavigationScroll();

    // アニメーション
    initAnimations();

    // モバイルメニュー
    initMobileMenu();

    // YouTube動画の自動再生
    initYouTubeAutoplay();

    // ビデオモーダルの初期化
    initVideoModal();
});

// スムーススクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// アコーディオン機能
function initAccordions() {
    // 追加オプションアコーディオン
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const content = accordionItem.querySelector('.accordion-content');
            const icon = this.querySelector('i');

            // 他のアコーディオンを閉じる
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherItem = otherHeader.closest('.accordion-item');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherHeader.querySelector('i');

                    otherItem.classList.remove('active');
                    otherContent.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // 現在のアコーディオンをトグル
            if (accordionItem.classList.contains('active')) {
                accordionItem.classList.remove('active');
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                accordionItem.classList.add('active');
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // FAQアコーディオン
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');

            // 他のFAQを閉じる
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherItem = otherQuestion.closest('.faq-item');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('i');

                    otherItem.classList.remove('active');
                    otherAnswer.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // 現在のFAQをトグル
            if (faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                faqItem.classList.add('active');
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// フォームバリデーション
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    const submitButton = document.querySelector('.submit-button');

    if (form && submitButton) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // バリデーション
            const isValid = validateForm(form);

            if (isValid) {
                // フォーム送信処理
                submitForm(form);
            }
        });

        // リアルタイムバリデーション
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// フィールドバリデーション
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;

    // エラーメッセージをクリア
    clearFieldError(field);

    // 必須チェック
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'この項目は必須です');
        return false;
    }

    // メールバリデーション
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '正しいメールアドレスを入力してください');
            return false;
        }
    }

    return true;
}

// フォーム全体のバリデーション
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// エラーメッセージ表示
function showFieldError(field, message) {
    field.classList.add('error');

    // 既存のエラーメッセージを削除
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 新しいエラーメッセージを追加
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#d32f2f';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';

    field.parentNode.appendChild(errorDiv);
}

// エラーメッセージクリア
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// フォーム送信
function submitForm(form) {
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;

    // ローディング状態
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;

    // フォームデータを収集
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // 実際の送信処理（ここではシミュレーション）
    setTimeout(() => {
        // 成功メッセージ
        showSuccessMessage();

        // フォームリセット
        form.reset();

        // ボタンを元に戻す
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        console.log('フォームデータ:', data);
    }, 2000);
}

// 成功メッセージ表示
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: #000;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            font-weight: 600;
        ">
            <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
            お問い合わせありがとうございます。24時間以内にご返信いたします。
        </div>
    `;

    const form = document.querySelector('.contact-form');
    form.insertBefore(successDiv, form.firstChild);

    // 3秒後にメッセージを削除
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ナビゲーション背景変更
function initNavigationScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
}

// アニメーション
function initAnimations() {
    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // アニメーション対象要素
    const animateElements = document.querySelectorAll(`
        .problem-item,
        .plan-card,
        .flow-step,
        .portfolio-item,
        .testimonial-item
    `);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // CSSでアニメーション定義
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #d32f2f;
            background-color: #ffebee;
        }

        .video-placeholder {
            transition: transform 0.3s ease;
        }

        .video-placeholder:hover {
            transform: scale(1.05);
        }

        .plan-card:hover .plan-cta {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// プラン選択時のスクロール
function scrollToContact(planName) {
    const contactSection = document.querySelector('#contact');
    const purposeSelect = document.querySelector('#purpose');

    if (contactSection && purposeSelect) {
        // フォームに事前入力
        purposeSelect.value = 'contest'; // デフォルト値

        // コンタクトセクションにスクロール
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // プラン情報をローカルストレージに保存
        localStorage.setItem('selectedPlan', planName);
    }
}

// プラン情報をフォームに反映
document.addEventListener('DOMContentLoaded', function() {
    const selectedPlan = localStorage.getItem('selectedPlan');
    const messageTextarea = document.querySelector('#message');

    if (selectedPlan && messageTextarea) {
        messageTextarea.value = `選択プラン: ${selectedPlan}\n\n`;
        localStorage.removeItem('selectedPlan');
    }
});

// モバイルメニュー
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // メニューリンクをクリックしたらメニューを閉じる
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            });
        });

        // 画面外をクリックしてメニューを閉じる
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        });
    }
}

// YouTube動画の自動再生
function initYouTubeAutoplay() {
    // ユーザーがページをクリックしたら動画を再生
    function attemptAutoplay() {
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && heroVideo.contentWindow) {
            try {
                // YouTube IFrame API経由で再生を試行
                heroVideo.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } catch (e) {
                console.log('YouTube autoplay failed:', e);
            }
        }
    }

    // ページロード後少し待ってから自動再生を試行
    setTimeout(attemptAutoplay, 2000);

    // ユーザーが何らかの操作をした時に再生を試行
    document.addEventListener('click', attemptAutoplay, { once: true });
    document.addEventListener('scroll', attemptAutoplay, { once: true });
    document.addEventListener('touchstart', attemptAutoplay, { once: true });
}

// ビデオモーダル機能
function initVideoModal() {
    const modal = document.getElementById('videoModal');

    // モーダル外をクリックしたら閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

// 現在の動画ID保存用
let currentVideoId = null;

// ビデオモーダルを開く
function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const thumbnail = document.getElementById('modalVideoThumbnail');
    const title = document.getElementById('modalVideoTitle');
    const link = document.getElementById('modalVideoLink');

    // 現在の動画IDを保存
    currentVideoId = videoId;

    // 動画情報の設定
    const videoData = getVideoData(videoId);

    // サムネイル画像を設定（フォールバック付き）
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    thumbnail.onerror = function() {
        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    // 動画タイトルを設定
    title.textContent = videoData.title;

    // YouTubeリンクを設定
    link.href = `https://www.youtube.com/watch?v=${videoId}`;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 背景のスクロールを無効化
}

// モーダル内で動画を再生
function playModalVideo() {
    if (currentVideoId) {
        const thumbnailView = document.getElementById('videoThumbnailView');
        const playerView = document.getElementById('videoPlayerView');
        const errorView = document.getElementById('videoErrorView');
        const iframe = document.getElementById('modalVideoFrame');
        const playerTitle = document.getElementById('playerVideoTitle');

        // サムネイル表示を隠す
        thumbnailView.style.display = 'none';
        errorView.style.display = 'none';

        // 動画タイトルを設定
        const videoData = getVideoData(currentVideoId);
        playerTitle.textContent = videoData.title;

        // YouTube埋め込みURLを設定（最適化されたパラメータ）
        const embedUrl = createOptimizedEmbedUrl(currentVideoId);
        iframe.src = embedUrl;

        // プレイヤーを表示
        playerView.style.display = 'block';

        // エラーチェック（3秒後）
        setTimeout(() => {
            checkEmbedStatus(1);
        }, 3000);
    }
}

// 埋め込み状況をチェックしてリトライ
function checkEmbedStatus(attempt = 1) {
    const iframe = document.getElementById('modalVideoFrame');
    const playerView = document.getElementById('videoPlayerView');
    const errorView = document.getElementById('videoErrorView');

    // iframe読み込み確認（複数の方法を試行）
    let embedFailed = false;

    try {
        // Method 1: iframe属性チェック
        if (!iframe.src) {
            embedFailed = true;
        }

        // Method 2: contentWindow チェック
        if (iframe.src && iframe.contentWindow) {
            try {
                const iframeDoc = iframe.contentWindow.document;
                // アクセスできない場合は正常（クロスオリジン）
            } catch (e) {
                // クロスオリジンエラーは正常
            }
        } else if (iframe.src) {
            // contentWindowがない場合は失敗の可能性
            embedFailed = true;
        }

        // Method 3: HTTP エラーの検知
        iframe.onerror = function() {
            embedFailed = true;
        };

    } catch (e) {
        console.log('Embed check error:', e);
    }

    // 埋め込み失敗時のリトライ処理
    if (embedFailed && attempt < 4) {
        console.log(`Embed attempt ${attempt} failed, retrying...`);
        retryEmbed(attempt + 1);
    } else if (embedFailed && attempt >= 4) {
        console.log('All embed attempts failed, showing error');
        showEmbedError();
    }
}

// 埋め込みリトライ
function retryEmbed(attempt) {
    if (!currentVideoId || attempt > 4) return;

    const iframe = document.getElementById('modalVideoFrame');

    console.log(`Retrying embed with attempt ${attempt}`);

    // 新しいURLでリトライ
    const embedUrl = createOptimizedEmbedUrl(currentVideoId, attempt);
    iframe.src = embedUrl;

    // 次のチェック
    setTimeout(() => {
        checkEmbedStatus(attempt);
    }, 3000);
}

// 埋め込みエラー表示
function showEmbedError() {
    const playerView = document.getElementById('videoPlayerView');
    const errorView = document.getElementById('videoErrorView');
    const link = document.getElementById('modalVideoLink');

    // プレイヤーを隠してエラー表示
    playerView.style.display = 'none';
    errorView.style.display = 'block';

    // YouTubeリンクを更新
    if (currentVideoId) {
        link.href = `https://www.youtube.com/watch?v=${currentVideoId}`;
    }
}

// サムネイルに戻る
function backToThumbnail() {
    const thumbnailView = document.getElementById('videoThumbnailView');
    const playerView = document.getElementById('videoPlayerView');
    const errorView = document.getElementById('videoErrorView');
    const iframe = document.getElementById('modalVideoFrame');

    // プレイヤーを停止
    iframe.src = '';

    // ビューを切り替え
    playerView.style.display = 'none';
    errorView.style.display = 'none';
    thumbnailView.style.display = 'block';
}

// 最適化された埋め込みURL生成
function createOptimizedEmbedUrl(videoId, attempt = 1) {
    const baseUrl = 'https://www.youtube.com/embed/';
    const currentDomain = window.location.origin;

    let params;

    switch (attempt) {
        case 1:
            // 第1試行: 標準的なパラメータ
            params = new URLSearchParams({
                'autoplay': '1',
                'rel': '0',
                'modestbranding': '1',
                'enablejsapi': '1',
                'origin': currentDomain,
                'controls': '1',
                'fs': '1',
                'playsinline': '1'
            });
            break;
        case 2:
            // 第2試行: より制限の少ないパラメータ
            params = new URLSearchParams({
                'autoplay': '1',
                'rel': '0',
                'enablejsapi': '1',
                'controls': '1'
            });
            break;
        case 3:
            // 第3試行: 最小限のパラメータ
            params = new URLSearchParams({
                'autoplay': '1'
            });
            break;
        default:
            // フォールバック: パラメータなし
            params = new URLSearchParams();
    }

    return `${baseUrl}${videoId}?${params.toString()}`;
}

// 動画データを取得
function getVideoData(videoId) {
    const videoTitles = {
        'e8ugw03wRgU': 'Koh ＆ Syu - Serenade (M.Arnord)',
        'c8sjJG6iVv4': '悲しくてやりきれない HirotaMondenDuo',
        'YYS_LfwxtKs': 'The Water Is Wide - HirotaMondenDuo'
    };

    return {
        title: videoTitles[videoId] || '演奏動画'
    };
}

// ビデオモーダルを閉じる
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalVideoFrame');

    // プレイヤーを停止
    iframe.src = '';

    // 全てのビューをリセット
    backToThumbnail();

    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 背景のスクロールを有効化
}

