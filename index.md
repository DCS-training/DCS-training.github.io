---
title:
feature_text: |
  ## CDCS Training Material
  "Collaboration and community are at the heart of what we do"
feature_image: "https://www.cdcs.ed.ac.uk/files/2024-07/BannerImage_4.png"
excerpt: "This page is set up to facilitate the use of the CDCS repositories."
---

<html>
<head>
    <title>Repository Search</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    * {
        box-sizing: border-box;
        }
    /* Create three equal columns that floats next to each other */
  .column {
  float: left;
  width: 33.33%;
  padding: 10px;
  height: 300px; /* Should be removed. Only for demonstration */
}
/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
</head>
<body>
    <h1>Three Equal Columns</h1>
<div class="row">
  <div class="column" style="background-color:#aaa;">
    <h2>Column 1</h2>
    <p>Some text..</p>
  </div>
  <div class="column" style="background-color:#bbb;">
    <h2>Column 2</h2>
    <p>Some text..</p>
  </div>
  <div class="column" style="background-color:#ccc;">
    <h2>Column 3</h2>
    <p>Some text..</p>
  </div>
</div>
    <h1>Search GitHub Repositories</h1>
    <p>
    You can search the repositories either by topic or by title. 
    Each repository will contain a <strong>readme.md</strong> with instructions on their content and how to use them.
    </p>
    <!-- Search by Topic -->
    <h2>Search by Topic</h2>
    <p>
    You can use the search functions below to filter the repositories based on the topics they cover.
    You can either type a topic or select one from the drop-down menu.
    </p>
    <div>
        <input type="text" id="search-topic-input" placeholder="Search by topic">
        <select id="topic-select">
            <option value="">-- Select a Topic --</option>
        </select>
    </div>
    <!-- Search by Name -->
    <h2>Search by Name</h2>
    <p>
    Use the search function below to filter based on the repository name.
    </p>
    <div>
        <input type="text" id="search-name-input" placeholder="Search by repository name">
    </div>
    <ul id="repo-list"></ul>
    <h1> Contacts </h1>
    <p>
     {% include button.html text="Email Us" link="mailto:CDCS@ed.ac.uk" color="#f68140" %} 
     {% include button.html text="On Twitter" link="https://twitter.com/EdCDCS" color="#0d94e7" %} 
    </p>
    <script>
        const repos = {{ site.data.repos | jsonify }};
        console.log('Fetched repositories:', repos);
        function createSubstrings(str) {
            const substrings = [];
            for (let i = 0; i < str.length; i++) {
                for (let j = i + 1; j <= str.length; j++) {
                    substrings.push(str.slice(i, j));
                }
            }
            return substrings;
        }
        function createIndex(repos, field) {
            return lunr(function () {
                this.field('name');
                this.field(field);
                repos.forEach(repo => {
                    const fieldSubstrings = createSubstrings(repo[field].join ? repo[field].join(' ') : repo[field]);
                    this.add({
                        'name': repo.name,
                        [field]: fieldSubstrings.join(' '),
                        'id': repo.name
                    });
                });
            });
        }
        function populateTopicSelect(repos) {
            const topicSelect = document.getElementById('topic-select');
            const uniqueTopics = new Set();
            // Collect unique topics
            repos.forEach(repo => {
                repo.topics.forEach(topic => uniqueTopics.add(topic));
            });
            // Convert Set to array and sort alphabetically
            const sortedTopics = Array.from(uniqueTopics).sort();
            // Debug: log sorted topics
            console.log('Sorted topics:', sortedTopics);
            // Clear previous options
            topicSelect.innerHTML = '<option value="">-- Select a Topic --</option>';
            // Add sorted topics to the dropdown
            sortedTopics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic;
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        }
        function searchRepos(query, index, repos) {
            const results = index.search(`*${query}*`);
            const repoList = document.getElementById('repo-list');
            repoList.innerHTML = '';
            results.forEach(result => {
                const repo = repos.find(r => r.name === result.ref);
                if (repo) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${repo.url}">${repo.name}</a>`;
                    repoList.appendChild(li);
                }
            });
            if (results.length === 0) {
                repoList.innerHTML = '<li>No results found</li>';
            }
        }
        function initialize() {
            if (repos) {
                const topicIndex = createIndex(repos, 'topics');
                const nameIndex = createIndex(repos, 'name');
                populateTopicSelect(repos);  // Populate the dropdown with sorted topics
                document.getElementById('search-topic-input').addEventListener('input', function () {
                    const query = this.value;
                    searchRepos(query, topicIndex, repos);
                });
                document.getElementById('topic-select').addEventListener('change', function () {
                    const query = this.value;
                    searchRepos(query, topicIndex, repos);
                });
                document.getElementById('search-name-input').addEventListener('input', function () {
                    const query = this.value;
                    searchRepos(query, nameIndex, repos);
                });
            }
        }
        initialize();
    </script>
</body>
</html>

