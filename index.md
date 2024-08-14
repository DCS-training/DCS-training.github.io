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
</head>
<body>
    <h1>Our GitHub Repositories</h1>
    <p>All the material that we have prepared for our Training Porgramme is hosted in our <a href="https://github.com/DCS-training">GitHub Repository</a>. There are currently almost 80 repositories developped in the last 4 years. Each repository will contain a <strong>readme.md</strong> with instructions on their content and how to use them. You can search directly among the repositories using the Search tools at the bottom of this page. To facilitate self-learning we have also created a series of more self-contained tutorials that you can find below divided by topics.</p>
    <h2>Tutorials</h2>
        <div class="row">
        <div class="column">
        <h4>Good Practices of Digital Research</h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-10/Group%20in%20workshop.png" alt="Image 1">
        <ul>
           <li><a href="Tutorials/SPSSTutorial.html">From SPSS to R. How to Make your Statistical Analysis Reproducible</a></li>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Intro to Programming</h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-09/MicrosoftTeams-image%20%2810%29.png" alt="Image 2">
        <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Digitised Document & Text Analysis</h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-09/Recordings.png" alt="Image 3">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        </div>
        <div class="row">
        <div class="column">
        <h4>Data Wrangling & Data Visualisation</h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-09/weaving%20black%20and%20white.png" alt="Image 4">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Geographical Data & Digital Drawing </h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-09/Atlas%20Black%20and%20white.png" alt="Image 5">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Structured Data Analysis</h4>
        <img src="https://www.cdcs.ed.ac.uk/files/2023-09/Typewriter%20black%20and%20white.png" alt="Image 6">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        </div>
    <h2>Search GitHub Repositories</h2>
    <p>
    You can search the repositories either by topic or by title. 
    </p>
    <!-- Search by Topic -->
    <h3>Search by Topic</h3>
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
    <h3>Search by Name</h3>
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

