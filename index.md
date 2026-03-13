---
title:
feature_text: |
  ## CDCS Training Material
  "Collaboration and community are at the heart of what we do"
feature_image: "images/BannerImage.png"
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
    <p>All the material that we have prepared for our Training Programme is hosted in our <a href="https://github.com/DCS-training" target="_blank">GitHub Repository</a>. There are currently more than 10 repositories developped in the last 6 years. Each repository will contain a <strong>readme.md</strong> with instructions on their content and how to use them. You can search directly among the repositories using the Search tools at the bottom of this page. To facilitate self-learning we have also created a series of more self-contained tutorials that you can find below divided by topics.</p>
    <h2>Tutorials</h2>
        <div class="row">
        <div class="column">
        <h4>Good Practices of Digital Research</h4>
        <img src="images/Group in workshop.png" alt="Image 1">
  <ul>
           <li><a href="Tutorials/SPSSTutorial.html" target="_blank">Make your Statistical Analysis Reproducible (From SPSS to R)</a></li>
           <li><a href="Tutorials/ShinyApps.html" target="_blank">Share your research Results with Interactive Applications (SHINY)</a></li>
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
        <img src="images/Recordings.png" alt="Image 3">
        <ul>
        <li><a href="Tutorials/MappingAFamilyNetwork.html" target="_blank">Mapping a Family Network with Gephi</a></li>
           <li><a href="Tutorials/DecipheringAFinancialNetwork.html" target="_blank">Deciphering a Financial Network with Gephi</a></li>
           <li>More to Come Soon</li>
        </ul>
        </div>
        </div>
        <div class="row">
        <div class="column">
        <h4>Data Wrangling & Data Visualisation</h4>
        <img src="images/weaving black and white.png" alt="Image 4">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Geographical Data & Digital Drawing </h4>
        <img src="images/Atlas Black and white.png" alt="Image 5">
         <ul>
           <li>More to Come Soon</li>
        </ul>
        </div>
        <div class="column">
        <h4>Structured Data Analysis</h4>
        <img src="images/Typewriter black and white.png" alt="Image 6">
         <ul>
           <li><a href="Tutorials/bayesian-statistics.html">Introduction to Bayesian Statistics</a></li>
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
    <h3>Research Adaptation: Guidance and Case Studies</h3> 
    <p> In June 2021, the Centre for Data, Culture & Society and the Research Office of the College of Arts, Humanities and Social Sciences held three online workshops focused on adapting approaches to research in the context of ongoing remote and hybrid working.  Each workshop focused on one research area that has been significantly impacted by social distancing measures, with the aim of capturing ideas, resources, advice and tips from the community to share more widely. As a part of this work we were also able to resource the development of ethics guidance for social media research, and to gather a set of 'research adaptation case studies' provided by local researchers. While there is now a considerable amount of general resources and guidance available, we wanted to explore what is required locally for our community to move forward and invest in developing hybrid and remote research methods. </p>
    <h4> <a href="research-adaptation.html" target="blank">Explore More </a> </h4>
    <p></p>
    <h1> Contacts </h1>
    <p>
     {% include button.html text="Email Us" link="mailto:CDCS@ed.ac.uk" color="#fd0e67" %} 
     {% include button.html text="On BlueSky" link="https://bsky.app/profile/edcdcs.bsky.social" color="#002e5f" %} 
    </p>
    <script>
    const repos = {{ site.data.repos | jsonify }};
    console.log('Fetched repositories:', repos);
    function createIndex(repos, field) {
        return lunr(function () {
            this.ref('name');
            this.field('name');
            this.field(field);
            repos.forEach(repo => {
                const data = {
                    'name': repo.name,
                    'id': repo.name
                };
                data[field] = repo[field].join ? repo[field].join(' ') : repo[field];
                this.add(data);
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
    function searchRepos(query, index, repos, field, exactMatch = false) {
        const results = index.search(query);
        const repoList = document.getElementById('repo-list');
        repoList.innerHTML = '';
        results.forEach(result => {
            const repo = repos.find(r => r.name === result.ref);
            if (repo) {
                const fieldValue = repo[field];
                const matchesExact = exactMatch ? fieldValue.includes(query) : true;
                if (!field || matchesExact) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${repo.url}">${repo.name}</a>`;
                    repoList.appendChild(li);
                }
            }
        });
        if (results.length === 0 || repoList.innerHTML === '') {
            repoList.innerHTML = '<li>No results found</li>';
        }
    }
    function initialize() {
        if (repos) {
            const topicIndex = createIndex(repos, 'topics');
            const nameIndex = createIndex(repos, 'name');
            populateTopicSelect(repos);
            // Flexible search for topics when typing
            document.getElementById('search-topic-input').addEventListener('input', function () {
                const query = this.value.trim();
                searchRepos(query, topicIndex, repos, 'topics');  // flexible matching
            });
            // Exact search for topics when selecting from the dropdown
            document.getElementById('topic-select').addEventListener('change', function () {
                const query = this.value.trim();
                searchRepos(query, topicIndex, repos, 'topics', true);  // exact matching
            });
            // Flexible search for repository names
            document.getElementById('search-name-input').addEventListener('input', function () {
                const query = this.value.trim();
                searchRepos(query, nameIndex, repos, 'name');  // flexible matching
            });
        }
    }
    initialize();
</script>
</body>
</html>

