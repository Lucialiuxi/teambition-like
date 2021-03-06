import { Modal, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as workAction from '@/actions/workAction.js';
import { GetAllWorksFileUnderParentWorksFileServer } from '@/server/requestData.js';
import classnames from 'classnames';

/**
 * 点击的时候，存上一次的parentId，然后拿此次的myId作为新的parentId，到reducer里去替换
 */
//移动和复制 work文件的弹框
class MoveOrCopyWorkFilesMask extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
          visible: false,//控制弹框的显示
          title:'',//弹框的类型
          WorkFilesMenuListDataId:[],//显示的每一组WorkFilesMenuList里面li的parentId
          currentfileId:0,//当前所在的项目文件
          openFirstLiHighLight:[]//点击移动的文件所在文件以及所有父级都高亮
      }
  }
  componentWillMount(){ 
    //把当前所在的项目文件下的数据存到reducer中
    let { 
      location: { pathname }, 
      state:{ worksFile , WorkFileMoveAndCopyMaskData },
      saveAGroupOfSameParentIdWorkFilesAction,
      oneFileData
    } = this.props;
    let { WorkFilesMenuListDataId:abc } = this.state;
    let pathArr = pathname.split('/');
    let currentfileId = pathArr[2]*1;
    this.setState({ 
      currentfileId:currentfileId
    })
    if(pathArr.length===4){//显示顶层的work文件
      saveAGroupOfSameParentIdWorkFilesAction({ ParentId: '' , arr:worksFile });
      if(oneFileData){
        abc.push(oneFileData.myId);
        this.setState({
          WorkFilesMenuListDataId:abc
        })
      }
    }else if(pathArr.length===5){
      saveAGroupOfSameParentIdWorkFilesAction({ ParentId: pathArr[4]  ,  arr:worksFile });
      let AllKey = Object.keys(WorkFileMoveAndCopyMaskData);
      if(oneFileData){
        AllKey = AllKey.concat(oneFileData.myId);
        if(AllKey[0]===''){
          AllKey = AllKey.filter(val => val !== '');
        }
      }
      this.setState({
        WorkFilesMenuListDataId:AllKey
      })
    }
  }
  shouldComponentUpdate(nextProps){
    return true;
  }

  //点击 个人项目，查询项目文件下的work文件
  clickToSearchWorkFilesInsideAprojectFile = (e) => {
    let { 
      showTopLevelWorkFilesAction,
       } = this.props;
    let t = e.target;
    if(t.nodeName !== 'LI') return;
    let fileId = t.dataset.id*1;
    GetAllWorksFileUnderParentWorksFileServer({fileId,parentId:''}).then(({data})=>{
      if(data.success){
        showTopLevelWorkFilesAction({ ParentId: '' , arr:data.data })
      }
    })
    this.setState({
      currentfileId:fileId
    })
  }

  chooseWorkFile = (e) => {//点击WorkFilesMenuList下的li
      let t = e.target;
      let { state:{WorkFileMoveAndCopyMaskData } , 
            location: {pathname} ,
            pushAWorkFilesMenuListAction ,
            UpdateWorkFileMoveAndCopyMaskDataAction
          } = this.props;
      let { WorkFilesMenuListDataId , openFirstLiHighLight } = this.state;
      let arr=[];//拿到所有渲染文件目录的work文件数据
      for(let attr in WorkFileMoveAndCopyMaskData){ 
          arr.push(WorkFileMoveAndCopyMaskData[attr])
      }
      // console.log(arr)
      if(t.nodeName==="UL") return;
      let pUl = t.parentNode;
      let Lis = pUl.getElementsByTagName('li');
      Array.from(Lis).forEach(val=>{
        val.classList.remove('active');
      })
      t.classList.add('active');
      //点击选择了高亮的项目文件的id
      let fileId = document.getElementsByClassName('projectFileMenuItem active')[0].dataset.id*1;
      let len = arr.length;
      let clickedLiId = t.dataset.id;//当前被点击的li的id
      let ulId = t.parentNode.dataset.id;//当前被点击的li的父级ul的data-id
      //如果父级的id不存在，就说明是最后一组ul的里，就查询被点击的li的id,存到reducer对象里面，
      //如果存在，就把循环看点击的ul是第几个ul，然后把之后的几组数据删掉，在把查询的li的数据存起来
      //记录找到的ul是第几个
      let num = -1; 
      let index = -1;
      for(let attr in WorkFileMoveAndCopyMaskData){
        num++;
        if(attr===ulId){
          index = num;
        }
      }
      /**
       * ----------------------------------------------------
       * 点击的时候，渲染的UL的data-id没有更新对，连续两个Ul的data-id相同，后一个就会被删除
       */
      console.log(index)
      GetAllWorksFileUnderParentWorksFileServer({fileId,parentId: clickedLiId }).then(({data})=>{
        if(data.success){
          if(index===-1){//如果父级的id不存在，就说明是最后一组ul的里，就查询被点击的li的id,存到reducer对象里面
            console.log(data.data)
            pushAWorkFilesMenuListAction({ ParentId: clickedLiId , arr:data.data }) 
            console.log('添加')
          }else{//如果存在，就把循环看点击的ul是第几个ul，然后把之后的几组数据删掉
            console.log('替换')
            UpdateWorkFileMoveAndCopyMaskDataAction({ ulDataId:ulId , ParentId:clickedLiId, arr:data.data })
          }
        }
      })
      openFirstLiHighLight.splice(len-1)
      WorkFilesMenuListDataId.splice(len-1);
      WorkFilesMenuListDataId.push(t.dataset.id);
      this.setState({
        WorkFilesMenuListDataId,
        openFirstLiHighLight
      })
  }
  //移动和复制 work文件的弹框 显示
  showModal = (myId,e) => {
    let { state:{worksFilrCrumb,WorkFileMoveAndCopyMaskData}} = this.props;
    this.WorkFileMoveAndCopyMaskData = WorkFileMoveAndCopyMaskData;
    let arr = []
    worksFilrCrumb.forEach(val=>{
      arr.push(val.myId)
    })
    if(myId){
      arr.push(myId)
    }
    this.setState({
      openFirstLiHighLight:arr
    })
    let t = e.target;
    if(t.classList.contains('moveCheckedWorkFile') || 
      t.classList.contains('moveCheckedWorkFileIcon')
    ){
      this.setState({
        title:'移动'
      })
    }else if(t.classList.contains('copyCheckedWorkFile') || 
            t.classList.contains('copyCheckedWorkFileIcon')
    ){
      this.setState({
        title:'复制'
      })
    }
    this.setState({
      visible: true,
    });
  }

  handleOk = (myId,e) => {
    /*
    点击确认  
      单个复制OR移动：如果要移动到的文件夹就是自己，那么不进行操作 ；否则就把移动的文件夹的parentId和项目文件id进行修改
      多个复制OR移动: 移动到的目的地文件夹是当前选中移动的一个，就不操作；否则就把移动的文件夹的parentId和项目文件id进行修改
    */
    let { title } = this.state;
    let { closeWorkFileMoveAndCopyMaskAction 
        } = this.props;
    if(myId){//移动一个通过myId 复制OR移动 --> parentId 和 fileId
      if(title==='移动'){
        
      }else if(title==='复制'){

      }
    }else{//通过fileId,parentId,check 复制OR移动 --> parentId 和 fileId
      if(title==='移动'){

      }else if(title==='复制'){
        
      }
    }
    closeWorkFileMoveAndCopyMaskAction(this.WorkFileMoveAndCopyMaskData)
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    let { closeWorkFileMoveAndCopyMaskAction } = this.props;
    closeWorkFileMoveAndCopyMaskAction(this.WorkFileMoveAndCopyMaskData)
    this.setState({
      visible: false,
    });
  }

  render() {
    let { title , visible , WorkFilesMenuListDataId , currentfileId , openFirstLiHighLight } = this.state;
    let { checkedCount , 
          insideLi , 
          oneFileData,
          state:{ getFileInfo , WorkFileMoveAndCopyMaskData },
        } = this.props;
    let arr=[];
    for(let attr in WorkFileMoveAndCopyMaskData){ 
        arr.push(WorkFileMoveAndCopyMaskData[attr])
    }
    return (
      <div className="MoveOrCopyWorkFilesMaskWrap"> 
        { (oneFileData && insideLi) || checkedCount>0 ?
          <div className="moveAndCopyWorkFileWrap">
            <span className="moveCheckedWorkFile"  onClick={this.showModal.bind(this,oneFileData?oneFileData.myId:null)} >
                <Icon type="profile" className="moveCheckedWorkFileIcon" title={insideLi ? "移动文件夹" : ""} />
                {insideLi ? '' : '移动'}
            </span>
            <span className="copyCheckedWorkFile"  onClick={this.showModal.bind(this,oneFileData?oneFileData.myId:null)} >
                <Icon type="copy" className="copyCheckedWorkFileIcon" title={insideLi ? "复制文件夹" : ""} />
                {insideLi ? '' : '复制'}
            </span>
          </div> 
        : null}
        {visible ? <Modal
          className="MoveOrCopyWorkFilesMask"
          title={`${title}${checkedCount}个文件夹  至`}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this,oneFileData?oneFileData.myId:null)}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <section id="MoveOrCopyWorkFilesMaskContent">
              <div className="projectFileMenuContainer">
                  <h3 className="projectFileMenuTitle">个人项目</h3>
                  <ul className="projectFileMenuList" onClick={this.clickToSearchWorkFilesInsideAprojectFile}>
                    {getFileInfo.map(val=>{
                        return <li 
                                  className={classnames({'projectFileMenuItem':true,'active':val.fileId===currentfileId})}
                                  key={val.fileId}
                                  data-id={val.fileId}
                                >{val.FileName}</li>
                    })}
                  </ul>
              </div>
              <div className="WorkFilesMenuWrap">
                <div className="WorkFilesMenu">
                    {arr.map((val,index)=>{ 
                      return <ul 
                                className="WorkFilesMenuList" 
                                key={index} 
                                data-id={WorkFilesMenuListDataId[index]}
                                onClick={this.chooseWorkFile}
                              >
                              {
                                val.map((e,i)=>{
                                  return <li  
                                            className={classnames({"WorkFilesMenuItem":true, 'active':e.myId===openFirstLiHighLight[index] })}
                                            key={e.myId}
                                            data-id={e.myId}
                                          >{e.workFileName}</li>
                                })
                                
                              }
                            </ul> 
                    })}
              </div>
              </div>
          </section>
        </Modal> : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return  {
      state
  }
}

const  mapDispatchToProps = (dispatch) => {
  return bindActionCreators(workAction,dispatch)
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MoveOrCopyWorkFilesMask));