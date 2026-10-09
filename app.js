const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Carlos", valor: 0, status: "pago" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "João", valor: 80, status: "pendente" },
  { cliente: "Ana", valor: 200.5, status: "pago" }
];

const processarPedidos = (listaPedidos) => {
  const validosEPagos = listaPedidos
    .filter(p => p.cliente.trim() !== "" && typeof p.valor === "number" && p.valor > 0)
    .filter(p => p.status === "pago");

  const totalFaturado = validosEPagos.reduce((acc, p) => acc + p.valor, 0);

  const textosFormatados = validosEPagos.map(p => `${p.cliente} — R$ ${p.valor.toFixed(2)}`);

  console.log("Pedidos formatados:", textosFormatados);
  console.log(`Total faturado: R$ ${totalFaturado.toFixed(2)}`);
};

processarPedidos(pedidos);

const formCep = document.querySelector('#form-cep');
const inputCep = document.querySelector('#input-cep');
const btnCep = document.querySelector('#btn-cep');
const statusCep = document.querySelector('#status-cep');
const resultadoCep = document.querySelector('#resultado-cep');
const listaHistorico = document.querySelector('#lista-historico');

const historicoCeps = [];

formCep.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const cepLimpo = inputCep.value.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    exibirStatusCep("Por favor, digite um CEP válido com 8 números.", "erro");
    return;
  }

  exibirStatusCep("Buscando...", "");
  btnCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error("Erro ao comunicar com o servidor da ViaCEP.");
    }

    const data = await response.json();

    if (data.erro) {
      exibirStatusCep("CEP não encontrado.", "erro");
      return;
    }

    exibirStatusCep("CEP encontrado com sucesso!", "sucesso");
    renderizarDadosCep(data);
    adicionarAoHistorico(data);

  } catch (error) {

    if (error.name === "TimeoutError") {
      exibirStatusCep("A requisição demorou muito (Timeout).", "erro");
    } else {
      exibirStatusCep(`Falha na conexão: ${error.message}`, "erro");
    }
  } finally {
    btnCep.disabled = false;
  }
});

function exibirStatusCep(mensagem, classe) {
  statusCep.textContent = mensagem;
  statusCep.className = `status ${classe}`;
}

function renderizarDadosCep(dados) {
  const termos = [
    { termo: "Rua", definicao: dados.logradouro },
    { termo: "Bairro", definicao: dados.bairro },
    { termo: "Cidade", definicao: dados.localidade },
    { termo: "UF", definicao: dados.uf }
  ];

  termos.forEach(item => {
    if (item.definicao) {
      const dt = document.createElement('dt');
      dt.textContent = item.termo;
      dt.style.fontWeight = "bold";
      
      const dd = document.createElement('dd');
      dd.textContent = item.definicao;
      dd.style.marginBottom = "10px";

      resultadoCep.append(dt, dd);
    }
  });
}

function adicionarAoHistorico(dados) {
  const cepJaExiste = historicoCeps.some(item => item.cep === dados.cep);
  if (!cepJaExiste) {
    historicoCeps.push(dados);
    const li = document.createElement('li');
    li.textContent = `${dados.cep} - ${dados.localidade}/${dados.uf}`;
    listaHistorico.append(li);
  }
}

const formPokedex = document.querySelector('#form-pokedex');
const inputPokemon = document.querySelector('#input-pokemon');
const btnPokedex = document.querySelector('#btn-pokedex');
const statusPokedex = document.querySelector('#status-pokedex');
const resultadoPokedex = document.querySelector('#resultado-pokedex');

formPokedex.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pokemonBuscado = inputPokemon.value.trim().toLowerCase();
  if (!pokemonBuscado) {
    exibirStatusPokedex("Digite o nome de um Pokémon.", "erro");
    return;
  }

  exibirStatusPokedex("Procurando Pokémon...", "");
  btnPokedex.disabled = true;
  resultadoPokedex.replaceChildren();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonBuscado}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon não encontrado.");
      }
      throw new Error("Erro na comunicação com a PokéAPI.");
    }

    const pokemon = await response.json();

    exibirStatusPokedex("", ""); 
    renderizarPokemon(pokemon);

  } catch (error) {
    exibirStatusPokedex(error.message, "erro");
  } finally {
    btnPokedex.disabled = false;
  }
});

function exibirStatusPokedex(mensagem, classe) {
  statusPokedex.textContent = mensagem;
  statusPokedex.className = `status ${classe}`;
}

function renderizarPokemon(pokemon) {
  const nomeH3 = document.createElement('h3');
  nomeH3.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const imagemImg = document.createElement('img');
  imagemImg.src = pokemon.sprites.front_default;
  imagemImg.alt = `Sprite do ${pokemon.name}`;
  imagemImg.className = "pokemon-sprite";

  const tiposP = document.createElement('p');
  const tiposArrays = pokemon.types.map(t => t.type.name).join(', ');
  tiposP.textContent = `Tipo(s): ${tiposArrays}`;

  resultadoPokedex.append(nomeH3, imagemImg, tiposP);
}