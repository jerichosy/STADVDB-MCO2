const replicateDatabase = function replicateDatabase(syncer, arg1, arg2) {
    // Perform your replication task here, e.g., checking for updates and replicating data
    syncer(arg1, arg2)
        .then((result) => {
            // Handle the result
            // console.log("Replication task completed");

            // Schedule the next replication task only when the previous task is complete
            setTimeout(() => replicateDatabase(syncer, arg1, arg2), 5000);
        })
        .catch((error) => {
            // Handle the error
            console.error("An error occurred during replication:", error);

            // Schedule the next replication task only when the previous task is complete
            setTimeout(() => replicateDatabase(syncer, arg1, arg2), 5000);
        });
}

// Start the first replication task
// replicateDatabase();

module.exports = replicateDatabase;
