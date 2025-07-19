const autocannon = require('autocannon');

autocannon({
  url: 'http://localhost:3000/data',
  connections: 10,
  duration: 20,
  pipelining: 1,
}, (err, result) => {
  if (err) {
    console.error('❌ Load test failed:', err);
    return;
  }

  const statusStats = result.statusCodeStats || {};

  // Metrics
  const successCount = statusStats[200]?.count || 0;
  const totalRequests = result.requests.total;
  const failedCount = totalRequests - successCount;
  const avgLatencyAll = result.latency.average;
  const rps = result.requests.average;

  console.log('\n🚀 Load Test Summary');
  console.log('----------------------');
  console.log(`📊 Total Requests: ${totalRequests}`);
  console.log(`✅ Success (200): ${successCount}`);
  console.log(`❌ Failed or Other: ${failedCount}`);
  console.log(`⚡ Requests per second: ${rps} req/sec`);
  console.log(`⏱️  Avg Latency (All): ${avgLatencyAll} ms`);

  if (successCount > 0) {
    const successLatencyEstimate = result.latency.p99; // Estimate
    console.log(`🎯 Estimated Avg Latency (Successes): ~${successLatencyEstimate} ms`);
  } else {
    console.log(`🎯 Estimated Avg Latency (Successes): N/A (no successes)`);
  }

  console.log('----------------------\n');
});
