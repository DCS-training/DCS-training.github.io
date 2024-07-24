<!DOCTYPE html>
<html>
<head>
    <title>Repository Search</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
</head>
<body>
    <h1>Search GitHub Repositories</h1>
    <input type="text" id="search-input" placeholder="Search by topic...">
    <select id="topic-select">
        <option value="">-- Select a Topic --</option>
    </select>
    <ul id="repo-list"></ul>

    <script>
        // Using Jekyll to inject the repos.json data
        const repos = {{ site.data.repos | jsonify }};
        console.log('Fetched repositories:', repos); // Debugging line

        function createIndex(repos) {
            return lunr(function () {
                this.field('name');
                this.field('topics');

                repos.forEach(repo => {
                    this.add({
                        'name': repo.name,
                        'topics': repo.topics.join(' '),
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

            console.log('Unique topics:', uniqueTopics); // Debugging line

            uniqueTopics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic;
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        }

        function searchRepos(query, index, repos) {
            const results = index.search(query);
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
                const index = createIndex(repos);
                populateTopicSelect(repos);

                document.getElementById('search-input').addEventListener('input', function () {
                    const query = this.value;
                    searchRepos(query, index, repos);
                });

                document.getElementById('topic-select').addEventListener('change', function () {
                    const query = this.value;
                    searchRepos(query, index, repos);
                });
            }
        }

        initialize();
    </script>
</body>
</html>
