<!DOCTYPE html>
<html>
<head>
    <title>Repository Search</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
</head>
<body>
    <h1>Search GitHub Repositories</h1>
    <input type="text" id="search-input" placeholder="Search by topic...">
    <ul id="repo-list"></ul>

    <script>
        async function fetchRepos() {
            try {
                const response = await fetch('/_data/repos.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching repos:', error);
            }
        }

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

        document.getElementById('search-input').addEventListener('input', async function () {
            const query = this.value;
            const repos = await fetchRepos();
            if (repos) {
                const index = createIndex(repos);
                searchRepos(query, index, repos);
            }
        });
    </script>
</body>
</html>

