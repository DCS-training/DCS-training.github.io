<!DOCTYPE html>
<html>
<head>
    <title>Repository Search</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
</head>
<body>
    <h1>Search GitHub Repositories</h1>
    
    <!-- Search by Topic -->
    <h2>Search by Topic</h2>
    <div>
        <input type="text" id="search-topic-input" placeholder="Search by topic">
        <select id="topic-select">
            <option value="">-- Select a Topic --</option>
        </select>
    </div>
    
    <!-- Search by Name -->
    <h2>Search by Name</h2>
    <div>
        <input type="text" id="search-name-input" placeholder="Search by repository name">
    </div>
    
    <ul id="repo-list"></ul>

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

            repos.forEach(repo => {
                repo.topics.forEach(topic => uniqueTopics.add(topic));
            });

            uniqueTopics.forEach(topic => {
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
                populateTopicSelect(repos);

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
