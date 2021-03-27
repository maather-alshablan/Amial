
import { database , auth} from '../../Configuration/firebase'


export  function RequestDropAuthorization(OwnerID, DriverID, authorizationStartDate){

  
    var requestRef =   database.collection('DataSets')
    .where('StartDate','<=',authorizationStartDate)
    .where('Owner.ID','==', OwnerID)
    .where('Driver.ID','==',DriverID);

    if (requestRef)
    requestRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
        return true;
      });
      
return false;
}