//移动和复制文件遮罩的渲染数据
const WorkFileMoveAndCopyMaskData = ( state = {} , action ) => {
    switch (action.type){
        //点击进入文件的时候把每层的文件的parentId和文件信息存下来
        case 'SAVE_A_GROUP_OF_SAME_PARENTID_WOKRFILES_ACTION':
            let { obj:{ParentId , arr} } = action;
            let a = {};
            a[ParentId]=arr;
            let newState = Object.assign({},state,a);
        return newState;

        //清空
        case 'EMPTY_A_GROUP_OF_SAME_PARENTID_WOKRFILES_ACTION':
        return state = {};

        //点击移动和复制 workfile的弹框的个人项目目录，后值只显示顶层文件
        case 'SHOW_TOP_LEVEL_WORKFILES_ACTION':
            let p = action.obj.ParentId;
            let nState = {};
            nState[p]=action.obj.arr;
        return nState;

        //点击最后一个WorkFilesMenuList下的li
        case 'PUSH_A_WORKFILESMENULIST_ACTION':
            let Obj = {};
            Obj[action.obj.ParentId] = action.obj.arr;
            let longerState =  Object.assign({},state,Obj);
        return longerState;

        //点击的不是最后一个WorkFilesMenuList下的li，parentId 有ulDataId重复的，之后的都删除，把{ParentId:String , arr:[{},{},...]}加进去
        case 'UPDATE_WORKFILE_MOVE_AND_COPY_MASKDATA_ACTION':
            let updateState =  Object.assign({},state);
            let newObj = {};
            for(let attr in updateState){
                if(attr === action.obj.ulDataId){
                    if(action.obj.ulDataId[0]){
                        newObj[attr] = action.obj.arr;
                    }
                    break;
                }
                newObj[attr] = updateState[attr];
            }
        return newObj;
        
        //关闭移动复制弹框，数据回答打开之前的状态
        case 'CLOSE_WORKFILEMOVEANDCOPYMASK_ACTION':
        return action.obj;

        //刷新works页面不在顶层文件的话，把cookie存的拿出来存起来
        case 'GET_WORKFILEMOVEANDCOPYMASKDATA_ACTION':
        return action.obj;
        
        //跟切换的面包屑导航同步数据 
        case 'KEEP_SYNC_ACTION':
            let syncState =  Object.assign({},state);
            let copysyncState = {};
            for(let attr in syncState){
                copysyncState[attr] = syncState[attr];
                if(attr===action.myId){
                    break;
                }
            }
        return copysyncState;
        
        case 'STAY_AT_FIRST_LEVEL_ACTION':
            let OBJ = {};
            for(let attr in state){
                if(attr===''){
                    OBJ[attr]=state[attr]
                }
            }
        return OBJ;
    default:
        return state;
    }
}

export default WorkFileMoveAndCopyMaskData;