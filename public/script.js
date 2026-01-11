function addExpense() {
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const customCategory = document.getElementById("customCategory").value;
  const amount = document.getElementById("amount").value;

  // basic validation
  if (!date || !category || !amount) {
    alert("Please select date, category and enter amount");
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date,
      category,
      customCategory,
      amount
    })
  })
  .then(() => location.reload())
  .catch(err => console.error(err));
}



fetch("/expenses")
  .then(res => res.json())
  .then(data => {

    const table = document.getElementById("expenseTable");

    table.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Details</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    `;

    // Group expenses by date
    const groupedByDate = {};

    data.forEach(e => {
      if (!groupedByDate[e.date]) {
        groupedByDate[e.date] = [];
      }
      groupedByDate[e.date].push(e);
    });

    // Build table + calculate grand total
    let grandTotal = 0;

    Object.keys(groupedByDate).forEach(date => {
      const expenses = groupedByDate[date];

      let dailyTotal = 0;
      let detailsHtml = "<ul>";

      expenses.forEach(e => {
        const name = e.custom_category || e.category;
        dailyTotal += Number(e.amount);

        detailsHtml += `
          <li>
            ${name} : ₹${e.amount}
            <button class="delete-btn"
              onclick="event.stopPropagation(); deleteExpense(${e.id})">❌</button>
          </li>
        `;
      });

      detailsHtml += "</ul>";

      grandTotal += dailyTotal; // ✅ accumulate overall total

      table.innerHTML += `
        <tr class="date-row" onclick="toggleDetails(this)">
          <td>▶ ${date}</td>
          <td class="details hidden">${detailsHtml}</td>
          <td>₹${dailyTotal}</td>
          <td>—</td>
        </tr>
      `;
    });

    // ✅ Show grand total in UI
    document.getElementById("grandTotal").innerText = "₹" + grandTotal;

    // Pie chart
    updatePieChart(data);
  });




function toggleDetails(row) {
  const detailsCell = row.querySelector(".details");
  detailsCell.classList.toggle("hidden");
}




function updatePieChart(data) {
  const totals = {};
  let chartGrandTotal = 0;

  data.forEach(e => {
    const name = e.custom_category || e.category;
    const amt = Number(e.amount);
    totals[name] = (totals[name] || 0) + amt;
    chartGrandTotal += amt;
  });

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  const ctx = document.getElementById("chart");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        borderWidth: 2
      }]
    },
    options: {
      cutout: "65%",
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const percent = ((value / chartGrandTotal) * 100).toFixed(1);
              return `${context.label}: ${percent}% (₹${value})`;
            }
          }
        }
      }
    }
  });
}




function deleteExpense(id) {
  fetch(`/delete/${id}`, { method: "DELETE" })
    .then(() => location.reload());
}
