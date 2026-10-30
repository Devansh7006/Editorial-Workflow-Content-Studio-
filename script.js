const defaultArticles = [
  {
    id: 1,
    title: "HTML5 & CSS3 Project Guide",
    category: "Web Dev",
    author: "Devansh",
    stage: "In Review",
    abstract: "Comprehensive web design workflow documentation",
    content: "A responsive editorial workflow interface built using semantic HTML5, modern CSS3, and Bootstrap 5.3 components. Designed with a sleek dark Sanity-inspired theme for college presentation."
  },
  {
    id: 2,
    title: "Database Management Systems",
    category: "Database",
    author: "Ayush",
    stage: "Published",
    abstract: "Relational database schemas and query indexing",
    content: "Relational schemas and SQL query indexing for academic coursework."
  },
  {
    id: 3,
    title: "Computer Networks Notes",
    category: "Networking",
    author: "Devansh",
    stage: "Draft",
    abstract: "OSI 7 layer architecture & TCP/IP protocols",
    content: "Detailed study notes on networking layers and TCP/IP protocol stack."
  }
];

let currentTopicFilter = "All";

function getArticles() {
  let stored = localStorage.getItem("editorial_articles");
  if (stored !== null && stored !== "") {
    return JSON.parse(stored);
  }
  saveArticles(defaultArticles);
  return defaultArticles;
}

function saveArticles(list) {
  localStorage.setItem("editorial_articles", JSON.stringify(list));
}

function getQueryParameter(name) {
  let query = window.location.search;
  if (query.indexOf("?") === 0) {
    query = query.substring(1);
  }
  let pairs = query.split("&");
  for (let i = 0; i < pairs.length; i++) {
    let parts = pairs[i].split("=");
    if (parts[0] === name) {
      return decodeURIComponent(parts[1]);
    }
  }
  return null;
}

function renderDashboard() {
  let articles = getArticles();
  let totalCount = articles.length;
  let draftCount = 0;
  let reviewCount = 0;
  let publishedCount = 0;

  for (let i = 0; i < articles.length; i++) {
    let item = articles[i];
    if (item.stage === "Draft") {
      draftCount++;
    } else if (item.stage === "In Review") {
      reviewCount++;
    } else if (item.stage === "Published") {
      publishedCount++;
    }
  }

  let totalEl = document.getElementById("total-articles-count");
  if (totalEl) {
    totalEl.textContent = totalCount;
  }

  let reviewEl = document.getElementById("review-articles-count");
  if (reviewEl) {
    reviewEl.textContent = reviewCount;
  }

  let publishedEl = document.getElementById("published-articles-count");
  if (publishedEl) {
    publishedEl.textContent = publishedCount;
  }

  let reviewBar = document.getElementById("review-articles-progress");
  if (reviewBar) {
    let reviewPercent = 0;
    if (totalCount > 0) {
      reviewPercent = Math.round((reviewCount / totalCount) * 100);
    }
    reviewBar.style.width = reviewPercent + "%";
  }

  let publishedBar = document.getElementById("published-articles-progress");
  if (publishedBar) {
    let publishedPercent = 0;
    if (totalCount > 0) {
      publishedPercent = Math.round((publishedCount / totalCount) * 100);
    }
    publishedBar.style.width = publishedPercent + "%";
  }

  let draftBadge = document.getElementById("stage-draft-count");
  if (draftBadge) {
    draftBadge.textContent = draftCount + (draftCount === 1 ? " Story" : " Stories");
  }

  let reviewBadge = document.getElementById("stage-review-count");
  if (reviewBadge) {
    reviewBadge.textContent = reviewCount + (reviewCount === 1 ? " Story" : " Stories");
  }

  let publishedBadge = document.getElementById("stage-published-count");
  if (publishedBadge) {
    publishedBadge.textContent = publishedCount + (publishedCount === 1 ? " Story" : " Stories");
  }

  let pipelineBadge = document.getElementById("pipeline-count-badge");
  if (pipelineBadge) {
    pipelineBadge.textContent = totalCount + (totalCount === 1 ? " story" : " stories");
  }

  let tbody = document.getElementById("articles-table-body");
  if (tbody) {
    let html = "";
    for (let i = 0; i < articles.length; i++) {
      let art = articles[i];
      let stageBadge = "bg-secondary";
      let stageIcon = "bi-pencil";

      if (art.stage === "In Review") {
        stageBadge = "bg-warning text-dark";
        stageIcon = "bi-clock";
      } else if (art.stage === "Published") {
        stageBadge = "bg-success";
        stageIcon = "bi-check-circle";
      }

      let initial = "D";
      let colorClass = "bg-danger";
      if (art.author && art.author.length > 0) {
        initial = art.author.charAt(0).toUpperCase();
        if (initial === "A") {
          colorClass = "bg-success";
        }
      }

      html += "<tr>";
      html += "<td><div class='fw-bold text-white'>" + art.title + "</div><div class='text-secondary small'>" + art.abstract + "</div></td>";
      html += "<td><span class='badge bg-secondary'>" + art.category + "</span></td>";
      html += "<td><div class='d-flex align-items-center gap-2'><span class='badge rounded-circle " + colorClass + " p-1' style='width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;'>" + initial + "</span><span class='small'>" + art.author + "</span></div></td>";
      html += "<td><span class='badge " + stageBadge + "'><i class='bi " + stageIcon + " me-1'></i>" + art.stage + "</span></td>";
      html += "<td><div class='d-flex gap-1'><a href='editor.html?id=" + art.id + "' class='btn btn-outline-secondary btn-sm rounded-pill px-3'><i class='bi bi-pencil me-1'></i>Edit</a><button type='button' class='btn btn-outline-danger btn-sm rounded-pill px-2' onclick='removeArticle(" + art.id + ")'><i class='bi bi-trash'></i></button></div></td>";
      html += "</tr>";
    }

    if (articles.length === 0) {
      html = "<tr><td colspan='5' class='text-center text-secondary py-4'>No articles in pipeline. Click New Article to add one.</td></tr>";
    }

    tbody.innerHTML = html;
  }
}

function renderBoard(filter) {
  if (filter) {
    currentTopicFilter = filter;
  }

  let filterButtons = document.querySelectorAll(".topic-filter");
  for (let i = 0; i < filterButtons.length; i++) {
    let btn = filterButtons[i];
    let topic = btn.getAttribute("data-topic");
    if (topic === currentTopicFilter) {
      btn.className = "btn btn-dark btn-sm border-secondary text-white rounded-pill px-3 topic-filter active";
    } else {
      btn.className = "btn btn-outline-secondary btn-sm rounded-pill px-3 text-secondary topic-filter";
    }
  }

  let articles = getArticles();
  let draftList = [];
  let reviewList = [];
  let publishedList = [];

  for (let i = 0; i < articles.length; i++) {
    let art = articles[i];
    let matchesTopic = (currentTopicFilter === "All" || art.category === currentTopicFilter);

    if (matchesTopic) {
      if (art.stage === "Draft") {
        draftList.push(art);
      } else if (art.stage === "In Review") {
        reviewList.push(art);
      } else if (art.stage === "Published") {
        publishedList.push(art);
      }
    }
  }

  let draftBadge = document.getElementById("board-draft-count");
  if (draftBadge) {
    draftBadge.textContent = draftList.length + (draftList.length === 1 ? " Story" : " Stories");
  }

  let reviewBadge = document.getElementById("board-review-count");
  if (reviewBadge) {
    reviewBadge.textContent = reviewList.length + (reviewList.length === 1 ? " Story" : " Stories");
  }

  let publishedBadge = document.getElementById("board-published-count");
  if (publishedBadge) {
    publishedBadge.textContent = publishedList.length + (publishedList.length === 1 ? " Story" : " Stories");
  }

  let draftContainer = document.getElementById("board-draft-list");
  if (draftContainer) {
    let html = "";
    for (let i = 0; i < draftList.length; i++) {
      let item = draftList[i];
      html += "<div class='card card-inner p-3 rounded-3 shadow-sm mb-3'>";
      html += "<div class='d-flex justify-content-between align-items-start mb-2'>";
      html += "<span class='badge bg-secondary' style='font-size: 10px;'>" + item.category + "</span>";
      html += "<span class='text-secondary small' style='font-size: 11px;'><i class='bi bi-clock me-1'></i>Draft</span>";
      html += "</div>";
      html += "<div class='fw-bold text-white small mb-1'>" + item.title + "</div>";
      html += "<p class='text-secondary small mb-3' style='font-size: 11px;'>" + item.abstract + "</p>";
      html += "<div class='d-flex justify-content-between align-items-center pt-2 border-top border-secondary'>";
      html += "<span class='text-secondary small' style='font-size: 11px;'><i class='bi bi-person me-1'></i>" + item.author + "</span>";
      html += "<div class='d-flex gap-1'>";
      html += "<a href='editor.html?id=" + item.id + "' class='btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill' style='font-size: 11px;'>Edit</a>";
      html += "<button type='button' onclick='changeStage(" + item.id + ", \"In Review\")' class='btn btn-warning btn-sm py-0 px-2 rounded-pill text-dark fw-bold' style='font-size: 11px;'>Review &rarr;</button>";
      html += "</div></div></div>";
    }
    if (draftList.length === 0) {
      html = "<div class='text-secondary small text-center py-4'>No draft stories</div>";
    }
    draftContainer.innerHTML = html;
  }

  let reviewContainer = document.getElementById("board-review-list");
  if (reviewContainer) {
    let html = "";
    for (let i = 0; i < reviewList.length; i++) {
      let item = reviewList[i];
      html += "<div class='card card-inner p-3 rounded-3 shadow-sm mb-3'>";
      html += "<div class='d-flex justify-content-between align-items-start mb-2'>";
      html += "<span class='badge bg-secondary' style='font-size: 10px;'>" + item.category + "</span>";
      html += "<span class='badge bg-warning text-dark' style='font-size: 10px;'>Awaiting Approval</span>";
      html += "</div>";
      html += "<div class='fw-bold text-white small mb-1'>" + item.title + "</div>";
      html += "<p class='text-secondary small mb-3' style='font-size: 11px;'>" + item.abstract + "</p>";
      html += "<div class='d-flex justify-content-between align-items-center pt-2 border-top border-secondary'>";
      html += "<span class='text-secondary small' style='font-size: 11px;'><i class='bi bi-person me-1'></i>" + item.author + "</span>";
      html += "<div class='d-flex gap-1'>";
      html += "<button type='button' onclick='changeStage(" + item.id + ", \"Draft\")' class='btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill' style='font-size: 11px;'>&larr; Draft</button>";
      html += "<a href='editor.html?id=" + item.id + "' class='btn btn-orange btn-sm py-0 px-2 rounded-pill fw-bold' style='font-size: 11px;'>Review</a>";
      html += "<button type='button' onclick='changeStage(" + item.id + ", \"Published\")' class='btn btn-success btn-sm py-0 px-2 rounded-pill fw-bold' style='font-size: 11px;'>Publish &rarr;</button>";
      html += "</div></div></div>";
    }
    if (reviewList.length === 0) {
      html = "<div class='text-secondary small text-center py-4'>No stories in review</div>";
    }
    reviewContainer.innerHTML = html;
  }

  let publishedContainer = document.getElementById("board-published-list");
  if (publishedContainer) {
    let html = "";
    for (let i = 0; i < publishedList.length; i++) {
      let item = publishedList[i];
      html += "<div class='card card-inner p-3 rounded-3 shadow-sm mb-3'>";
      html += "<div class='d-flex justify-content-between align-items-start mb-2'>";
      html += "<span class='badge bg-secondary' style='font-size: 10px;'>" + item.category + "</span>";
      html += "<span class='badge bg-success' style='font-size: 10px;'>Live</span>";
      html += "</div>";
      html += "<div class='fw-bold text-white small mb-1'>" + item.title + "</div>";
      html += "<p class='text-secondary small mb-3' style='font-size: 11px;'>" + item.abstract + "</p>";
      html += "<div class='d-flex justify-content-between align-items-center pt-2 border-top border-secondary'>";
      html += "<span class='text-secondary small' style='font-size: 11px;'><i class='bi bi-person me-1'></i>" + item.author + "</span>";
      html += "<div class='d-flex gap-1'>";
      html += "<button type='button' onclick='changeStage(" + item.id + ", \"In Review\")' class='btn btn-outline-warning btn-sm py-0 px-2 rounded-pill' style='font-size: 11px;'>&larr; Review</button>";
      html += "<a href='editor.html?id=" + item.id + "' class='btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill' style='font-size: 11px;'>View</a>";
      html += "<button type='button' onclick='removeArticle(" + item.id + ")' class='btn btn-outline-danger btn-sm py-0 px-2 rounded-pill' style='font-size: 11px;'><i class='bi bi-trash'></i></button>";
      html += "</div></div></div>";
    }
    if (publishedList.length === 0) {
      html = "<div class='text-secondary small text-center py-4'>No published stories</div>";
    }
    publishedContainer.innerHTML = html;
  }
}

function filterBoard(topic) {
  renderBoard(topic);
}

function changeStage(id, newStage) {
  let articles = getArticles();
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].id === id) {
      articles[i].stage = newStage;
      break;
    }
  }
  saveArticles(articles);

  if (document.getElementById("board-draft-list")) {
    renderBoard(currentTopicFilter);
  }
  if (document.getElementById("articles-table-body")) {
    renderDashboard();
  }
}

function removeArticle(id) {
  let confirmDelete = window.confirm("Are you sure you want to delete this article?");
  if (!confirmDelete) {
    return;
  }

  let articles = getArticles();
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].id === id) {
      articles.splice(i, 1);
      break;
    }
  }
  saveArticles(articles);

  if (document.getElementById("articles-table-body")) {
    renderDashboard();
  }
  if (document.getElementById("board-draft-list")) {
    renderBoard(currentTopicFilter);
  }
}

function setupEditor() {
  let form = document.getElementById("article-form");
  if (!form) {
    return;
  }

  let editIdStr = getQueryParameter("id");
  let isEditing = false;
  let articles = getArticles();

  if (editIdStr !== null && editIdStr !== "") {
    let editId = parseInt(editIdStr);
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].id === editId) {
        let art = articles[i];
        document.getElementById("article-id").value = art.id;
        document.getElementById("article-title").value = art.title;
        document.getElementById("article-author").value = art.author;
        document.getElementById("article-category").value = art.category;
        document.getElementById("article-stage").value = art.stage;
        document.getElementById("article-abstract").value = art.abstract;
        document.getElementById("article-content").value = art.content;
        isEditing = true;

        let heading = document.getElementById("editor-header-title");
        if (heading) {
          heading.textContent = "Edit Article #" + art.id;
        }
        break;
      }
    }
  }

  if (!isEditing) {
    let idInput = document.getElementById("article-id");
    if (idInput) {
      idInput.value = "";
    }
  }

  form.onsubmit = function(event) {
    event.preventDefault();
    saveArticleFromInputs(null);
  };

  let draftBtn = document.getElementById("btn-save-draft");
  if (draftBtn) {
    draftBtn.onclick = function() {
      saveArticleFromInputs("Draft");
    };
  }
}

function saveArticleFromInputs(overrideStage) {
  let title = document.getElementById("article-title").value;
  let author = document.getElementById("article-author").value;
  let category = document.getElementById("article-category").value;
  let stage = document.getElementById("article-stage").value;
  let abstract = document.getElementById("article-abstract").value;
  let content = document.getElementById("article-content").value;
  let idVal = document.getElementById("article-id").value;

  if (overrideStage) {
    stage = overrideStage;
  }

  if (title.trim() === "") {
    alert("Please enter an article title.");
    return;
  }

  let articles = getArticles();

  if (idVal !== "") {
    let targetId = parseInt(idVal);
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].id === targetId) {
        articles[i].title = title;
        articles[i].author = author;
        articles[i].category = category;
        articles[i].stage = stage;
        articles[i].abstract = abstract;
        articles[i].content = content;
        break;
      }
    }
  } else {
    let maxId = 0;
    for (let i = 0; i < articles.length; i++) {
      if (articles[i].id > maxId) {
        maxId = articles[i].id;
      }
    }
    let newId = maxId + 1;

    let newArticle = {
      id: newId,
      title: title,
      author: author,
      category: category,
      stage: stage,
      abstract: abstract,
      content: content
    };

    articles.push(newArticle);
  }

  saveArticles(articles);
  window.location.href = "dashboard.html";
}

function renderIndexPreview() {
  let articles = getArticles();
  let reviewCount = 0;
  let publishedCount = 0;

  for (let i = 0; i < articles.length; i++) {
    if (articles[i].stage === "In Review") {
      reviewCount++;
    } else if (articles[i].stage === "Published") {
      publishedCount++;
    }
  }

  let reviewCountEl = document.getElementById("preview-review-count");
  if (reviewCountEl) {
    reviewCountEl.innerHTML = "<i class='bi bi-clock me-1'></i>" + reviewCount + " Pending Review";
  }

  let publishedCountEl = document.getElementById("preview-published-count");
  if (publishedCountEl) {
    publishedCountEl.innerHTML = "<i class='bi bi-check-circle me-1'></i>" + publishedCount + " Published";
  }

  let tbody = document.getElementById("preview-table-body");
  if (tbody) {
    let html = "";
    let limit = articles.length;
    if (limit > 3) {
      limit = 3;
    }

    for (let i = 0; i < limit; i++) {
      let art = articles[i];
      let badgeClass = "bg-secondary";
      if (art.stage === "In Review") {
        badgeClass = "bg-warning text-dark";
      } else if (art.stage === "Published") {
        badgeClass = "bg-success";
      }

      html += "<tr>";
      html += "<td><span class='fw-bold text-dark'>" + art.title + "</span><div class='text-secondary small'>" + art.abstract + "</div></td>";
      html += "<td><span class='badge bg-light text-dark border'>" + art.category + "</span></td>";
      html += "<td>" + art.author + "</td>";
      html += "<td><span class='badge " + badgeClass + "'>" + art.stage + "</span></td>";
      html += "<td><a href='editor.html?id=" + art.id + "' class='btn btn-outline-dark btn-sm rounded-pill px-3'>View</a></td>";
      html += "</tr>";
    }

    if (articles.length === 0) {
      html = "<tr><td colspan='5' class='text-center text-secondary py-3'>No articles published yet.</td></tr>";
    }

    tbody.innerHTML = html;
  }
}

window.onload = function() {
  if (document.getElementById("articles-table-body")) {
    renderDashboard();
  }
  if (document.getElementById("board-draft-list")) {
    renderBoard("All");
  }
  if (document.getElementById("article-form")) {
    setupEditor();
  }
  if (document.getElementById("preview-table-body")) {
    renderIndexPreview();
  }
};