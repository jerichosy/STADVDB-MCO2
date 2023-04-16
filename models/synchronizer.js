const { node1, node2, node3, node_utils } = require('./nodes.js');
const transaction_utils = require('./transaction.js');

const sync_utils = {

    //sync_central 1 <--2&3
    //sync_fragment 2 <-- 1  OR 3 <-- 1

    sync_fragment: async function (frag_node, frag_node_num){
        if (await node_utils.pingNode(1)) {
            // get latest id from Node 1 and selected Node
            // compare if same
            // if not, get new log records from node 1
                // else, no need to sync
            // put each new data record in central_log 
            

            var query1 = (`SELECT MAX(log_id) as log_id_max FROM log_table_0`+ frag_node_num); 
            var query2 = (`SELECT MAX(log_id) as log_id_max FROM log_table`);
            const maxCentralResult = await transaction_utils.do_transaction(1, query1);
            const maxFragResult = await transaction_utils.do_transaction(frag_node_num, query2);

            if(maxFragResult[0].log_id_max === null){
                maxFragResult[0].log_id_max = 0;
            }

            const maxCentral = maxCentralResult[0].log_id_max
            const maxFrag = maxFragResult[0].log_id_max

            if(maxCentral > maxFrag){
                var central_log_records_query = (`SELECT * FROM log_table_0`+ frag_node_num + ` WHERE log_id > ` + maxFrag);
                const central_log = await transaction_utils.do_transaction(1, central_log_records_query);
                for(i = 0; i < maxCentral - maxFrag; i++){
                    var query = "";
                    switch (central_log[i].action) {
                        case "INSERT" : {
                            console.log("INSERTING HERE");
                            if(await node_utils.pingNode(frag_node_num)){
                                const query = `INSERT INTO movies (id, title, year, genre, director, actor) VALUES ('` + central_log[i].id + `', '` +central_log[i].title + `', '` + central_log[i].year  + `','` +
                                    central_log[i].genre + `', '` + central_log[i].director + `', '`  + central_log[i].actor + `')`;

                                await transaction_utils.do_transaction(frag_node_num, query);
                                console.log("INSERTED");
                            }
                            break;
                        }
                        case "DELETE" : {
                            console.log("DELETING HERE")
                            if(await node_utils.pingNode(frag_node_num)){
                                const query = `DELETE FROM movies WHERE id = ` + central_log[i].id;
                                await transaction_utils.do_transaction(frag_node_num, query);
                                console.log("DELETED")
                            }
                            break;
                        }
                        case "UPDATE" : {
                            console.log("UPDATING HERE")
                            if (await node_utils.pingNode(frag_node_num)){
                                const query = `UPDATE movies SET ` +
                                `title='` + central_log[i].title + `',` +
                                `year=` + central_log[i].year + `,` +
                                `genre='` + central_log[i].genre + `',` +
                                `director='` + central_log[i].director + `',` +
                                `actor='` + central_log[i].actor + `' ` +
                                `WHERE id=` + central_log[i].id;

                                await transaction_utils.do_transaction(frag_node_num, query);
                                console.log("UPDATED");
                            }
                            break;
                        }
                    }
                    
                }
            }
            else if(maxCentral < maxFrag){
                // this.sync_central()
                console.log("Central needs to be synced");
            }
            
        }
        else {

        } 
        
    },

    sync_central: async function(){
        let node_02_log = [];
        let node_03_log = [];
        let combined_log = [];

        if(await node_utils.pingNode(1)){
            //central and 2
            var query1 = (`SELECT MAX(log_id) as log_id_max FROM log_table_02`); 
            var query2 = (`SELECT MAX(log_id) as log_id_max FROM log_table_03`); 
            var query3 = (`SELECT MAX(log_id) as log_id_max FROM log_table`);
            const maxCentral2Result = await transaction_utils.do_transaction(1, query1);
            const maxCentral3Result = await transaction_utils.do_transaction(1, query2);
            const maxFrag2Result = await transaction_utils.do_transaction(2, query3);
            const maxFrag3Result = await transaction_utils.do_transaction(3, query3);

            if(maxFrag2Result[0].log_id_max === null){
                maxFrag2Result[0].log_id_max = 0;
            }
            if(maxFrag3Result[0].log_id_max === null){
                maxFrag3Result[0].log_id_max = 0;
            }
            if(maxCentral2Result[0].log_id_max === null){
                maxCentral2Result[0].log_id_max = 0;
            }
            if(maxCentral3Result[0].log_id_max === null){
                maxCentral3Result[0].log_id_max = 0;
            }

            let maxCentral2 = maxCentral2Result[0].log_id_max;
            let maxCentral3 = maxCentral3Result[0].log_id_max
            let maxFrag2 = maxFrag2Result[0].log_id_max
            let maxFrag3 = maxFrag3Result[0].log_id_max

            if (maxCentral2 < maxFrag2){
                var node_02_records_query = (`SELECT * FROM log_table WHERE log_id > ` + maxCentral2);
                node_02_log = await transaction_utils.do_transaction(2, node_02_records_query);
            }
            else if (maxCentral2 > maxFrag2){
                // this.sync_fragment(node2, 2)
                console.log("Node 2 needs to be synced");
            }

            if (maxCentral3 < maxFrag3) {
                var node_03_records_query = (`SELECT * FROM log_table WHERE log_id > ` + maxCentral3);
                node_03_log = await transaction_utils.do_transaction(3, node_03_records_query);
            }
            else if (maxCentral3 > maxFrag3){
                // this.sync_fragment(node3, 3)
                console.log("Node 3 needs to be synced");
            }

            combined_log = node_02_log.concat(node_03_log);
            combined_log.sort((a, b) => b.action_time - a.action_time);
            
            for(i = 0; i < combined_log.length; i++){
                var query = "";
                switch (combined_log[i].action) {
                    case "INSERT" : {
                        console.log("INSERTING HERE");
                        if(await node_utils.pingNode(1)){
                            const query = `INSERT INTO movies (id, title, year, genre, director, actor) VALUES ('` + combined_log[i].id + `', '` +combined_log[i].title + `', '` + combined_log[i].year  + `','` +
                            combined_log[i].genre + `', '` + combined_log[i].director + `', '`  + combined_log[i].actor + `')`;

                            await transaction_utils.do_transaction(1, query);
                            console.log("INSERTED RECORD ON CENTRAL");
                        }
                        break;
                    }
                    case "DELETE" : {
                        console.log("DELETING HERE")
                        if(await node_utils.pingNode(1)){
                            const query = `DELETE FROM movies WHERE id = ` + combined_log[i].id;
                            await transaction_utils.do_transaction(1, query);
                            console.log("DELETED RECORD ON CENTRAL")
                        }
                        break;
                    }
                    case "UPDATE" : {
                        console.log("UPDATING HERE")
                        if (await node_utils.pingNode(1)){
                            const query = `UPDATE movies SET ` +
                                `title='` + combined_log[i].title + `',` +
                                `year=` + combined_log[i].year + `,` +
                                `genre='` + combined_log[i].genre + `',` +
                                `director='` + combined_log[i].director + `',` +
                                `actor='` + combined_log[i].actor + `' ` +
                                `WHERE id=` + combined_log[i].id;

                            await transaction_utils.do_transaction(1, query);
                            console.log("UPDATED RECORD ON CENTRAL")
                        }
                        
                        break;
                    }
                }
                
            }
            
        }
    }
}

module.exports = sync_utils;