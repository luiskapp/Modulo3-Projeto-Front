const baseUrl = "http://localhost:3000/paletas";

async function findAllPaletas() {
    const response = await fetch(`${baseUrl}/find-paletas`);

    const paletas = await response.json();
    paletas.forEach((paleta) => {
    document.getElementById("paletaList").insertAdjacentHTML(
    "beforeend",
      `<div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
        <div>
          <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
          <div class="PaletaListaItem__preco">R$ ${paleta.preco.toFixed(2)}</div>
          <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
          <div class="PaletaListaItem__acoes Acoes">
            <button class="Acoes__editar btn" onclick="abrirModal("${paleta._id}")">Editar</button>
            <button class="Acoes__apagar btn" onclick="abrirModalDelete("${paleta._id}")>Apagar</button>
          </div>
        </div>
        <img class="PaletaListaItem__foto" src=${paleta.foto} alt=${`Paleta de ${paleta.sabor}`} />
        
      </div>`
      );
    });

};

async function findByIdPaletas() {

  const id = document.getElementById("idPaleta").value;

  const response = await fetch(`${baseUrl}/find-paleta/${id}`);

  const paleta = await response.json();

  const paletaEscolhidaDiv = document.getElementById("paletaEscolhida");

  paletaEscolhidaDiv.innerHTML = `<div class="PaletaCardItem" id="PaletaListaItem_${paleta._id}">
    <div>
      <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
      <div class="PaletaCardItem__preco">R$ ${paleta.preco}</div>
      <div class="PaletaCardItem__descricao">${paleta.descricao}</div>
    </div>
    <img class="PaletaCardItem__foto" src=${paleta.foto} alt=${`Paleta de ${paleta.sabor}`} />
  </div>`;

};

findAllPaletas();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText = "Atualizar uma Paleta";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseUrl}/find-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
    document.querySelector("#id").value = paleta.id;
  } else {
    document.querySelector("#title-header-modal").innerText = "Cadastrar uma Paleta";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }
    document.querySelector(".modal-overlay").style.display = "flex";
}
  
function fecharModalCadastro() {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector("#sabor").value = "";
    document.querySelector("#preco").value = 0;
    document.querySelector("#descricao").value = "";
    document.querySelector("#foto").value = "";
  }

async function createPaleta() {
    const id = document.getElementById("id").value;
    let sabor = document.querySelector("#sabor").value;
    let preco = document.querySelector("#preco").value;
    let descricao = document.querySelector("#descricao").value;
    let foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    descricao,
    foto,
    preco,
  };

  const modoEdicaoAtivado = id > 0;

  const endpoint = baseUrl + (modoEdicaoAtivado ? `/update/${id}` : '/create');

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

    const novaPaleta = await response.json();

    const html = `<div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
      <div>
        <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
        <div class="PaletaListaItem__preco">R$ ${novaPaleta.preco}</div>
        <div class="PaletaListaItem__descricao">${novaPaleta.descricao}</div>
      </div>
      <img class="PaletaListaItem__foto" src=${novaPaleta.foto} alt=${`Paleta de ${novaPaleta.sabor}`} />
    </div>`;
  
    if (modoEdicaoAtivado) {
      document.querySelector(`#PaletaListaItem_${id}`).outerHTML = html;
    } else {
      document.querySelector("#paletaList").insertAdjacentHTML("beforeend", html);
    }

    document.getElementById("id").value = "";

    fecharModalCadastro();
};

function abrirModalDelete(_id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes")

  btnSim.addEventListener("click", function() {
    deletePaleta(id);
  })
}
function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}