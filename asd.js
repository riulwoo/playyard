const id = roominfo.filter(info, infoindex=>{
    const idarray = Object.values(info.id);
    const result = idarray.filter((id,index)=>{
        if(id == socket.id)
         return {infoindex : infoindex, index : index};
    })
    return result;
})
roominfo[id[0]].id[id[1]] = null;