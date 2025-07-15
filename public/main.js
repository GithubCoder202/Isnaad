// NewsAPI integration for endless article cards
function createArticleCard(article) {
  // Use a fallback image if urlToImage is missing
  const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=600';
  return `
    <div class="article-card">
      <div style="position: relative;">
        <img src="${imageUrl}" alt="${article.title}" class="article-image">
        <button class="bookmark-btn"><i class="far fa-bookmark"></i></button>
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${article.source?.name || 'News'}</span>
          <span class="article-date">${article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}</span>
        </div>
        <h3 class="article-title">${article.title}</a></h3>
        <p class="article-desc">${article.description || ''}</p>
        <div class="article-footer">
          <a href="${article.url}" class="read-more" target="_blank">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `;
}

async function loadArticles(page = 1) {
  const grid = document.getElementById('articles-grid');
  try {
    const response = await fetch(`/news?page=${page}`);
    const data = await response.json();
    if (data.articles && data.articles.length > 0) {
      data.articles.forEach(article => {
        grid.insertAdjacentHTML('beforeend', createArticleCard(article));
      });
      return data.articles.length;
    }
  } catch (e) {
    if (grid.childElementCount === 0) {
      grid.innerHTML = '<p>No articles found.</p>';
    }
  }
  return 0;
}

// Infinite scroll variables and handler are now declared only once below

// --- News Tab Search ---
let allNewsArticles = [];
function createArticleCard(article) {
  const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=600';
  return `
    <div class="article-card">
      <div style="position: relative;">
        <img src="${imageUrl}" alt="${article.title}" class="article-image">
        <button class="bookmark-btn"><i class="far fa-bookmark"></i></button>
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${article.source?.name || 'News'}</span>
          <span class="article-date">${article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}</span>
        </div>
        <h3 class="article-title">${article.title}</a></h3>
        <p class="article-desc">${article.description || ''}</p>
        <div class="article-footer">
          <a href="${article.url}" class="read-more" target="_blank">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `;
}

async function loadArticles(page = 1, append = true) {
  const grid = document.getElementById('articles-grid');
  try {
    const response = await fetch(`/news?page=${page}`);
    const data = await response.json();
    if (data.articles && data.articles.length > 0) {
      if (!append) grid.innerHTML = '';
      data.articles.forEach(article => {
        if (!allNewsArticles.some(a => a.url === article.url)) {
          allNewsArticles.push(article);
        }
        if (append) grid.insertAdjacentHTML('beforeend', createArticleCard(article));
      });
      return data.articles.length;
    }
  } catch (e) {
    if (grid.childElementCount === 0) {
      grid.innerHTML = '<p>No articles found.</p>';
    }
  }
  return 0;
}

function filterNewsArticles(query) {
  const grid = document.getElementById('articles-grid');
  grid.innerHTML = '';
  const filtered = allNewsArticles.filter(article => {
    const q = query.toLowerCase();
    return (
      (article.title && article.title.toLowerCase().includes(q)) ||
      (article.description && article.description.toLowerCase().includes(q)) ||
      (article.source?.name && article.source.name.toLowerCase().includes(q))
    );
  });
  if (filtered.length === 0) {
    grid.innerHTML = '<p>No articles found.</p>';
  } else {
    filtered.forEach(article => grid.insertAdjacentHTML('beforeend', createArticleCard(article)));
  }
}

// Infinite scroll
let currentPage = 1;
let loading = false;
let allLoaded = false;

async function handleScroll() {
  if (loading || allLoaded) return;
  const grid = document.getElementById('articles-grid');
  const rect = grid.getBoundingClientRect();
  if (rect.bottom < window.innerHeight + 200) {
    loading = true;
    const loaded = await loadArticles(++currentPage);
    if (!loaded) allLoaded = true;
    loading = false;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  // Initial load
  await loadArticles(currentPage);
  window.addEventListener('scroll', handleScroll);
  // News search bar
  const newsSearch = document.getElementById('news-search-input');
  if (newsSearch) {
    newsSearch.addEventListener('input', function() {
      filterNewsArticles(this.value);
    });
  }
});

// --- History Tab Search ---
function filterHistoryCards(query) {
  const cards = document.querySelectorAll('#history-tab .history-card');
  let anyVisible = false;
  cards.forEach(card => {
    const title = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.article-desc')?.textContent.toLowerCase() || '';
    const category = card.querySelector('.article-category')?.textContent.toLowerCase() || '';
    const q = query.toLowerCase();
    if (title.includes(q) || desc.includes(q) || category.includes(q)) {
      card.style.display = '';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  // Optionally show a message if nothing is found
  const grid = document.querySelector('#history-tab .history-grid');
  if (!anyVisible && grid) {
    if (!grid.querySelector('.no-history-msg')) {
      const msg = document.createElement('div');
      msg.className = 'no-history-msg';
      msg.style = 'padding: 30px; color: #b91c1c; font-weight: 600;';
      msg.textContent = 'No history found.';
      grid.appendChild(msg);
    }
  } else if (grid) {
    const msg = grid.querySelector('.no-history-msg');
    if (msg) msg.remove();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const historySearch = document.getElementById('history-search-input');
  if (historySearch) {
    historySearch.addEventListener('input', function() {
      filterHistoryCards(this.value);
    });
  }
});

    // AI Validation and Scraping

    // Enhanced verifier: accepts both URLs and plain text
    async function verifyInput() {
      const input = document.getElementById('verification-url').value.trim();
      const output = document.getElementById('output');
      // Simple URL regex (http/https, at least one dot, no spaces)
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/i;
      if (!input) {
        alert('Please enter a URL or paste article text.');
        return;
      }
      // If input looks like a URL, try to scrape
      if (urlPattern.test(input)) {
        output.textContent = "Scraping... please wait.";
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(input)}`);
          if (!response.ok) throw new Error('Failed to fetch article');

          const data = await response.json();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'text/html');

          const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title || 'Not found';
          const publisher = doc.querySelector('meta[property="og:site_name"]')?.content || 'Unknown';
          const published = doc.querySelector('meta[property="article:published_time"]')?.content || 'Unknown';
          const article = doc.querySelector('article')?.innerText || '';

          if (!article || article === 'Article content not found.') {
            throw new Error('Could not extract article text. Please copy and paste the article text below.');
          }

          // Compose the text to send to Gemini
          const articleText = `Title: ${title}\nPublisher: ${publisher}\nPublished: ${published}\n\n${article.substring(0, 10000)}${article.length > 10000 ? '...\n(Content truncated)' : ''}`;
          await setUserInputText(articleText);
        } catch (err) {
          output.innerHTML = `<span style='color:red;'>❌ ${err.message}</span><br><br><b>Tip:</b> If this is a paywalled or unsupported site, please copy and paste the article text above and click Verify again.`;
        }
      } else {
        // Treat as plain text, send directly to Gemini
        await setUserInputText(input);
      }
    }

        // Tab Navigation
        document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.nav-tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding tab content
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Category tabs
            const categoryTabs = document.querySelectorAll('.category-tab');
            categoryTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    categoryTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Bookmark functionality
            const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
            bookmarkBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const icon = this.querySelector('i');
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        this.classList.add('active');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        this.classList.remove('active');
                    }
                });
            });
            
            // AI Verification
            const verifyBtn = document.getElementById('verify-btn');
            const verificationSpinner = document.getElementById('verification-spinner');
            const verificationResult = document.getElementById('verification-result');
            
            if (verifyBtn) {
                verifyBtn.addEventListener('click', async function() {
                    const urlInput = document.getElementById('verification-url');
                    if (!urlInput.value.trim()) {
                        alert('Please enter a URL or paste article text.');
                        return;
                    }
                    verificationSpinner.style.display = 'block';
                    verificationResult.style.display = 'block';
                    await verifyInput();
                    verificationSpinner.style.display = 'none';
                    verificationResult.style.display = 'block';
                });
            }
        });
        
        // Google OAuth Response Handler
        function handleCredentialResponse(response) {
            // In a real application, you would send this to your backend for verification
            console.log("Google OAuth response:", response);
            
            // Simulate successful login
            alert("Successfully signed in with Google!");
            
            // Update UI with user info
            document.querySelector('.account-avatar').innerHTML = '<i class="fas fa-user-check"></i>';
            document.querySelector('.account-info h2').textContent = "Signed In User";
            document.querySelector('.account-info p').textContent = "user@example.com";
        }

        // Gemini Integration

const MODEL = "models/gemini-1.5-flash";
let conversation = [];
const SYSTEM_PROMPT = `You are an Islamic research assistant. Read the following article text carefully. Then analyze it strictly according to the structure below. Use clear, factual, Islamically grounded information.\n\n✅ How to determine the Islamic Accuracy Percentage:\n\nBase the percentage primarily on Quranic verses and authentic hadith that directly support or contradict the article’s claims.\n\nIf the article topic is not explicitly covered in the Quran or hadith, draw on widely accepted Islamic scholarly opinions, historical Islamic practices, or consensus (ijma).\n\nIf none of these apply, only then may you cautiously consider relevant general ethical principles or modern interpretations.\n\nYour response must include:\n\n1️⃣ Islamically Accurate Percentage — Estimate how Islamically accurate the content is, based on the above priorities.\n\n2️⃣ Summary — Summarize the article in 2–3 sentences.\n\n3️⃣ Islamic Perspective — Provide relevant Quran verses, hadith, or teachings that align with or challenge the article’s content. Include authentic references with chapter and verse or source.\n\n4️⃣ Historical Parallels — Give 2–3 historical Islamic examples that relate to the topic, such as practices, scholars, or events.\n\n5️⃣ Recommendations — Suggest specific ways the article could be made more Islamically grounded, such as adding relevant Quran verses, hadith, or historical examples.\n\n⚠️ Always format your final output exactly like this example:\n\nAnalysis Complete\n[Islamically Accurate Percentage]% Islamically Accurate\n\nSummary\n[Your short summary here]\n\nIslamic Perspective\n[Your Islamic perspective here]\n\nHistorical Parallels\n[List relevant historical parallels here]\n\nRecommendations\n[List recommendations here]\nIf the input instead contains any kind of error message instead of an article, simply repeat that error exactly or rephrase it in a clear, user-friendly way. Do not add anything outside this format.`;

    // User input is now a variable, not from an input box

    // User input is now a variable, not from an input box
    let userInputText = ""; // Do not set directly, use setUserInputText()
    async function setUserInputText(val) {
      userInputText = val;
      await sendMessage();
    }

    async function sendMessage() {
      const userMessage = userInputText.trim();
      if (!userMessage) return;

    // Always prepend the system prompt before the user message for Gemini
    const promptConversation = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "user", parts: [{ text: userMessage }] }
    ];

    const output = document.getElementById("output");
    output.textContent = "Thinking...";
    try {
      const response = await fetch("/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: promptConversation, model: MODEL })
      });

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini.";

      // Format Gemini response for better readability
      output.innerHTML = formatGeminiResponse(botReply);
      conversation.push({ role: "user", parts: [{ text: userMessage }] });
      conversation.push({ role: "model", parts: [{ text: botReply }] });
    } catch (error) {
      output.textContent = "❌ Error: " + error.message;
    }
  }

    // Format Gemini response into HTML with headers and sections
    function formatGeminiResponse(text) {
      if (!text) return '';
      // Split by double newlines to get sections
      const sections = text.split(/\n\n+/);
      let html = '';
      // Section titles mapping
      const sectionTitles = [
        { key: /^Analysis Complete/i, tag: 'h2', class: 'result-title' },
        { key: /^(\d{1,3}% Islamically Accurate)/i, tag: 'div', class: 'result-accuracy' },
        { key: /^Summary$/i, tag: 'h3', class: 'result-section-title' },
        { key: /^Islamic Perspective$/i, tag: 'h3', class: 'result-section-title' },
        { key: /^Historical Parallels$/i, tag: 'h3', class: 'result-section-title' },
        { key: /^Recommendations$/i, tag: 'h3', class: 'result-section-title' }
      ];
      let lastSection = '';
      for (let i = 0; i < sections.length; i++) {
        let sec = sections[i].trim();
        if (!sec) continue;
        let matched = false;
        for (const t of sectionTitles) {
          const m = sec.match(t.key);
          if (m) {
            // If it's the accuracy, use the matched group
            if (t.class === 'result-accuracy') {
              html += `<div class="${t.class}">${m[1]}</div>`;
            } else {
              html += `<${t.tag} class="${t.class}">${sec}</${t.tag}>`;
            }
            lastSection = sec;
            matched = true;
            break;
          }
        }
        if (!matched) {
          // For content, use <p> and preserve line breaks
          // If the last section was a section title, add a wrapper div
          if (lastSection === 'Summary' || lastSection === 'Islamic Perspective' || lastSection === 'Historical Parallels' || lastSection === 'Recommendations') {
            html += `<div class="result-section"><p>${sec.replace(/\n/g, '<br>')}</p></div>`;
          } else {
            html += `<p>${sec.replace(/\n/g, '<br>')}</p>`;
          }
        }
      }
      return html;
    }

    // Example: call setUserInputText('Neuralink') to trigger Gemini
    // No need to auto-trigger on DOMContentLoaded for verification tab