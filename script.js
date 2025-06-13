// Function to adjust grid cells based on content
function adjustGridCells() {
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
        const cells = grid.children;
        let maxWidth = 0;
        
        // Find the maximum content width
        Array.from(cells).forEach(cell => {
            const width = cell.scrollWidth;
            maxWidth = Math.max(maxWidth, width);
        });
        
        // Set all cells to the maximum width
        Array.from(cells).forEach(cell => {
            cell.style.minWidth = `${maxWidth}px`;
        });
    });
}

// Function to handle responsive behavior
function handleResponsive() {
    const body = document.body;
    const width = body.clientWidth;
    
    // Adjust font size based on viewport width
    if (width < 40 * 16) { // 40ch
        body.style.fontSize = '14px';
    } else if (width < 60 * 16) { // 60ch
        body.style.fontSize = '16px';
    } else {
        body.style.fontSize = '18px';
    }
}

// Function to handle code blocks
function setupCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Add line numbers
        const lines = block.innerHTML.split('\n');
        const numberedLines = lines.map((line, i) => 
            `<span class="line-number">${i + 1}</span>${line}`
        ).join('\n');
        block.innerHTML = numberedLines;
    });
}

// Function to handle navigation highlighting
function setupNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Main categories
const categories = [
    "programming",
    "computability",
    "compilers",
    "philosophy",
    "artificial-intelligence",
    "linguistics"
];

// Function to create category list
function createCategoryList() {
    const container = document.getElementById('tags-container');
    
    const categoryList = document.createElement('ul');
    categoryList.className = 'tree';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/category/${category}`;
        a.textContent = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        li.appendChild(a);
        categoryList.appendChild(li);
    });
    
    container.appendChild(categoryList);
}

// Function to load posts from JSON
async function loadPosts() {
    try {
        const response = await fetch('/posts/index.json');
        const posts = await response.json();
        
        const container = document.getElementById('posts-container');
        
        // Sort posts by date (most recent first)
        const sortedPosts = posts.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Create and append post cards
        sortedPosts.forEach(post => {
            container.appendChild(createPostCard(post));
        });
    } catch (error) {
        console.log('No posts found yet');
    }
}

// Function to create a post card
function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    
    article.innerHTML = `
        <header>
            <h3><a href="${post.url}">${post.title}</a></h3>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
        </header>
        <p>${post.excerpt}</p>
        <div class="tags">
            ${post.categories.map(category => 
                `<span class="tag">${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>`
            ).join('')}
        </div>
        <a href="${post.url}" class="read-more">Read more →</a>
    `;
    
    return article;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    adjustGridCells();
    handleResponsive();
    setupCodeBlocks();
    setupNavigation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        adjustGridCells();
        handleResponsive();
    });
    
    createCategoryList();
    loadPosts();
}); 