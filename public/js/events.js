import { showGrafo } from "./script.js";

const URL = "http://localhost:8080";
let positions = []; // Vertices
const grafo = document.getElementById("grafo");
const button = document.querySelector("button[type=submit]");
const message = document.querySelector(".message");
const ciclo = document.querySelector(".ciclo");
const input = document.querySelector("input[type=file]");

let isClicked = false;

let clearTimeoutCode;

button.onclick = async (e) => {
  e.preventDefault();

  if (isClicked) return;
  if (clearTimeoutCode) clearTimeout(clearTimeoutCode);
  isClicked = true;

  setTimeout(() => (isClicked = false), 300);

  if (input.files.length) {
    const formData = new FormData(document.querySelector("form"));

    const data = await sendFile({
      method: "POST",
      body: formData,
    });

    if (data.error) return window.alert("Um erro ocorreu, desculpe :(");

    let id = 0;

    positions = Array.from({ length: data.qntVertices }, () => ({ id: id++ }));

    showGrafo(grafo, positions, data.adjacencias, data.qntArestas);

    if (data.cicloValues) {
      const tbody = document.querySelector("tbody");

      tbody.innerHTML = "";

      clearTimeoutCode = setTimeout(() => {
        for (let i = 0; i < data.cicloValues.length - 1; i++) {
          const origem = data.cicloValues[i];
          const destino = data.cicloValues[i + 1];
          const cidade1 = data.cidades.find((c) => c.index === origem);
          const cidade2 = data.cidades.find((c) => c.index === destino);

          tbody.innerHTML += `
              <tr>
                <td>${origem} - ${cidade1?.nome}</td>
                <td>${destino} - ${cidade2?.nome}</td>
              </tr>
            `;

          const edge1 = document.querySelector(
            `.edge[data-origem="${destino}"][data-destino="${origem}"]`
          );
          const edge2 = document.querySelector(
            `.edge[data-origem="${origem}"][data-destino="${destino}"]`
          );

          const eOrigem = document.querySelector(`div[data-id="${origem}"]`);
          const eDestino = document.querySelector(`div[data-id="${destino}"]`);

          setTimeout(() => {
            edge1?.classList.add("active");
            edge2?.classList.add("active");
            eOrigem?.classList.add("origem");
            eDestino?.classList.add("destino");
          }, 1000 * i);
        }
      }, 3000);
    }
  }
};

async function sendFile(options) {
  const req = await fetch(URL, options);
  const json = await req.json();
  return json;
}
