const server = 'http://localhost:50700';

export default async function loadDatas() {
  const response = await fetch(`${server}/balance`);
  const responseBalance = await response.json();
  document.getElementById("supplied_capital").innerHTML += `${responseBalance} `;
}
