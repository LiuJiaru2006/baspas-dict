let dataCache = [];

// 页面加载完成后绑定事件
window.onload = () => {
  document.getElementById("searchBtn").onclick = search;
  loadStele();
};

// 加载碑文 JSON
function loadStele() {
  const stele = document.getElementById("stele").value;

  fetch(`data/${stele}.json`)
    .then(r => r.json())
    .then(data => {
      dataCache = data;
      clearTable();
      console.log("数据加载成功：", data.length);
    })
    .catch(err => {
      alert("JSON 加载失败，请检查文件名和路径");
      console.error(err);
    });
}

// 查询
function search() {
  const direction = document.getElementById("direction").value;
  const keyword = document.getElementById("keyword").value.trim();

  if (!keyword) {
    alert("请输入查询内容");
    return;
  }

  let results = [];

  if (direction === "baspas") {
    results = dataCache.filter(d =>
      d.baspas && d.baspas.includes(keyword)
    );
  }

  if (direction === "latin") {
    const k = keyword.toLowerCase();
    results = dataCache.filter(d =>
      d.latin && d.latin.toLowerCase().includes(k)
    );
  }

  if (direction === "chinese") {
    results = dataCache.filter(d =>
      d.chinese && d.chinese.includes(keyword)
    );
  }

  render(results);
}

// 渲染结果
function render(list) {
  const body = document.getElementById("resultBody");
  body.innerHTML = "";

  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="4">未找到结果</td></tr>`;
    return;
  }

  list.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="baspas">${d.baspas || ""}</td>
      <td class="latin">${d.latin || ""}</td>
      <td>${d.code || ""}</td>
      <td class="chinese">${d.chinese || ""}</td>
    `;
    body.appendChild(tr);
  });
}

// 清空表格
function clearTable() {
  document.getElementById("resultBody").innerHTML = "";
}

// 切换碑文时自动重新加载
document.getElementById("stele").addEventListener("change", loadStele);
