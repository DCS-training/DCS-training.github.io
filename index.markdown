<!DOCTYPE html>
<html>
<head>
    <title>Repository Search</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
</head>
<body>
    <h1>Search GitHub Repositories</h1>
    <input type="text" id="search-input" placeholder="Search by tag...">
    <ul id="repo-list"></ul>

    <script>
        async function fetchRepos() {
            const response = await fetch('/_data/repos.json');
            return await response.json();
        }

        function createIndex(repos) {
            return lunr(function () {
                this.field('name');
                this.field('tags');

                repos.forEach(repo => {
                    this.add(repo);
                });
            });
        }

        function searchRepos(query, index, repos) {
            const results = index.search(query);
            const repoList = document.getElementById('repo-list');
            repoList.innerHTML = '';

            results.forEach(result => {
                const repo = repos.find(r => r.name === result.ref);
                const li = document.createElement('li');
                li.innerHTML = `<a href="${repo.url}">${repo.name}</a>`;
                repoList.appendChild(li);
            });
        }

        document.getElementById('search-input').addEventListener('input', async function () {
            const query = this.value;
            const repos = await fetchRepos();
            const index = createIndex(repos);
            searchRepos(query, index, repos);
        });
    </script>
</body>
</html>
