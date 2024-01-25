// Function to convert bytes to megabytes
const bytesToMegabytes = (bytes) => {
    return Math.round((bytes / (1024 * 1024)) * 100) / 100 ;
};

// Function to convert memory usage values to megabytes
const convertToMegabytes = (memoryUsage) => {
    return {
        rss: bytesToMegabytes(memoryUsage.rss),
        heapTotal: bytesToMegabytes(memoryUsage.heapTotal),
        heapUsed: bytesToMegabytes(memoryUsage.heapUsed),
        external: bytesToMegabytes(memoryUsage.external),
    };
};

const logMemoria = (start, end) => {    
    console.log('MEMORIA AL TERMINAR EL PROCESO:', end);
    console.log('-------------------------------------------------------');
    console.log('USO DE MEMORIA TOTAL:');
    console.log(`  - Resident Set Size (RSS): ${Math.round(end.rss - start.rss)} mb`);
    console.log(`  - Heap Total: ${Math.round(end.heapTotal - start.heapTotal)} mb`);
    console.log(`  - Heap Used: ${Math.round(end.heapUsed - start.heapUsed)} mb`);
    console.log(`  - External Memory: ${Math.round(end.external - start.external)} mb`);
    console.log('-------------------------------------------------------');
};    





module.exports = {
    convertToMegabytes,
    logMemoria,
};