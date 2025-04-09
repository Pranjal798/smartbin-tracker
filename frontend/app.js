document.getElementById("binForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const type = document.getElementById("type").value;
    const status = document.getElementById("status").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
  
    fetch("https://smartbin-tracker.onrender.com/bins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: document.getElementById("type").value,
          status: document.getElementById("status").value,
          lat: parseFloat(document.getElementById("lat").value),
          lng: parseFloat(document.getElementById("lng").value)
        })
      })
      .then(res => res.json())
      .then(data => {
        alert("✅ Bin added successfully!");
        location.reload(); // reload page to see the new bin
      })
      .catch(err => {
        console.error("Error adding bin:", err);
        alert("❌ Failed to add bin.");
      });
  });
  function updateBin(binId) {
    const newStatus = document.getElementById(`status-${binId}`).value;
  
    fetch(`https://smartbin-tracker.onrender.com/bins/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        alert("✅ Bin status updated");
        location.reload();
      })
      .catch(err => {
        console.error("Error updating bin:", err);
        alert("❌ Update failed");
      });
  }
  
  function deleteBin(binId) {
    if (!confirm("Are you sure you want to delete this bin?")) return;
  
    fetch(`https://smartbin-tracker.onrender.com/bins/${binId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        alert("🗑️ Bin deleted");
        location.reload();
      })
      .catch(err => {
        console.error("Error deleting bin:", err);
        alert("❌ Delete failed");
      });
  }
  let allBins = {};  // store bins for later distance calculation

function findNearestBin() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    let nearestBin = null;
    let shortestDist = Infinity;

    for (let key in allBins) {
      const bin = allBins[key];
      const dist = getDistance(userLat, userLng, bin.lat, bin.lng);

      if (dist < shortestDist) {
        shortestDist = dist;
        nearestBin = { ...bin, id: key };
      }
    }

    if (nearestBin) {
      map.setView([nearestBin.lat, nearestBin.lng], 16);
      L.popup()
        .setLatLng([nearestBin.lat, nearestBin.lng])
        .setContent(`<b>Nearest Bin</b><br>Type: ${nearestBin.type}<br>Status: ${nearestBin.status}<br>Distance: ${shortestDist.toFixed(2)} km`)
        .openOn(map);
    }
  }, () => {
    alert("❌ Unable to retrieve your location");
  });
}
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
