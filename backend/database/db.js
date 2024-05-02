const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("jelv_ps_barber", "jelv", "juanes0202*", {
    host:"mysql-jelv.alwaysdata.net",
    dialect:"mysql"
})

async function conexion(){
try{
    await sequelize.authenticate();
    console.log("Conexion Exitosa")
}catch(error){
 console.log("Tenemos un error", error)
}
}

conexion()

module.exports=sequelize;