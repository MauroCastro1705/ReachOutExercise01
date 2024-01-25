const Records = require('./records.model');
const fs = require('fs');
const csv = require('fast-csv');
const { convertToMegabytes, logMemoria } = require('./medirMemoria');

const upload = async (req, res) => {
    try {
        console.log('Comenzó el proceso de Upload');
        const initialMemoryUsage = convertToMegabytes(process.memoryUsage());
        console.log('USO DE MEMORIA INICIAL:', initialMemoryUsage);

        const { file } = req;
        const filePath = file.path;

        const records = [];
        const batchSize = 100;

        const readStream = fs.createReadStream(filePath); //leemos archivo

        const csvStream = csv.parse({ headers: true })
            .on('data', (row) => {
                // Process each row from the CSV
                const record = {
                    id: row.id,
                    firstname: row.firstname,
                    lastname: row.lastname,
                    email: row.email,
                    email2: row.email2,
                    profession: row.profession,
                };

                records.push(record); //cargamos el array con data parseada

                // limitamos cantidad de documentos por batch
                if (records.length === batchSize) {
                    const batch = [...records]; // spread o clonado de array para mantener formato
                    records.length = 0; // Clear the records array

                    // Insert the batch into the database
                    insertBatch(batch);
                }
            })
            .on('end', async () => {
                // insertamos documentos sobrantes al final
                if (records.length > 0) {
                    await insertBatch(records);
                }

                // All rows have been processed
                console.log(`Terminó el stream.`);

                // Cleanup: quitamos archivo del sistema
                fs.unlinkSync(filePath);

                //mensaje con estadisticas finales
                const finalMemoryUsage = convertToMegabytes(process.memoryUsage());
                logMemoria(initialMemoryUsage, finalMemoryUsage);

                return res.status(200).json({
                    message: 'Subido correctamente',
                });
            });

        //pasamos la data por la funcion de parseo
        readStream.pipe(csvStream);


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

// funcion de insercion de documentos
const insertBatch = async (batch) => {
    try {
        // insertMany a database + log 
        await Records.insertMany(batch);
        //cuantos docs por batch para control
        console.log(`Batch inserted successfully. Number of documents: ${batch.length}`); 
    } catch (error) {
        console.error('Error inserting batch:', error);
    }
};

//////////////////////////////////////
const list = async (_, res) => {
    try {
        const data = await Records.find({}).limit(10).lean();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    upload,
    list,
};