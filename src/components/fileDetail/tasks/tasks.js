import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TaskItem from './taskItem';
import TaskItemCreator from './taskItemCreator';
import * as taskActions from '@/actions/taskAction';
import * as workActions from '@/actions/workAction.js';
import { 
         GetAllSubTasksServer 
} from '@/server/requestData';

import CanlenderMode from './calenderMode';

import './tasks.css';

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deadlineData:{},
            isLoadingTaskItem:true
        }
    }
    componentWillMount(){
        let { location:{pathname} , findAllSubTasksInsideAfileAction } = this.props;
        let CurrentFileId = pathname.match(/\d+/g)[0]*1;
        if(CurrentFileId){
            GetAllSubTasksServer({fileId:CurrentFileId}).then(({data})=>{
                if(data.success){
                    findAllSubTasksInsideAfileAction(data.subTasksData)
                    this.setState({
                        isLoadingTaskItem:false
                    })
                }
            })
        }
    }
    componentDidMount(){
        this._isMounted = true;
        //  点击新建子任务编辑框 之外的地方  隐藏编辑框
        let {
            HideAllTaskItemCalenderAction,
            HideChoiceUrgencyLevelAction,
            HideAllSubTaskCreatorsAction,
            ToHideShowCurrentTaskItemNameCoverAction,
            HideTaskItemCreatorAction,
            HideTaskItemDropDownContainerAction,
            ToHideShowFileNameCoverAction,
            hideOrShowSearchBoxAction,
            hideOrShowProjectTypeSelectAction
            } = this.props;
        document.onclick=(e)=>{
            let target = e.target;
            //日历所有标签
            let CanlenderCondition = (
                target.classList.contains('CommonCanlender')||
                target.classList.contains('ant-alert')||
                target.classList.contains('ant-alert-message') ||
                target.classList.contains('ant-alert-description') ||
                target.classList.contains('ant-fullcalendar-header') ||
                target.classList.contains('ant-select-sm') ||
                target.classList.contains('ant-select-selection') ||
                target.classList.contains('ant-select-selection__rendered') ||
                target.classList.contains('ant-select-selection-selected-value') ||
                target.classList.contains('ant-select-arrow') ||
                target.classList.contains('ant-radio-group') ||
                target.classList.contains('ant-radio-group-small') ||
                target.classList.contains('ant-radio-button-wrapper')||
                target.classList.contains('ant-radio-button') ||
                target.classList.contains('ant-radio-button-inner') ||   
                target.classList.contains('ant-fullcalendar') ||   
                target.classList.contains('ant-fullcalendar-calendar-body') ||   
                target.nodeName==="TABLE" ||  
                target.nodeName==="THEEAD" ||
                target.nodeName==="TBODY" ||  
                target.nodeName==="TR" ||
                target.nodeName==="TD" || 
                target.nodeName==="TH" || 
                target.nodeName==="TFOOT" ||
                target.nodeName==="OPTION" ||
                target.nodeName==="SELECT" ||
                target.classList.contains('ant-fullcalendar-date') ||   
                target.classList.contains('ant-fullcalendar-value') ||   
                target.classList.contains('ant-fullcalendar-content') ||   
                target.classList.contains('ant-radio-button') ||   
                target.classList.contains('ant-radio-button-input') ||  
                target.classList.contains('ant-select-sm') ||   
                target.classList.contains('ant-fullcalendar-month-select') ||   
                target.classList.contains('ant-select') ||   
                target.classList.contains('ant-select-enabled') ||   
                target.classList.contains('ant-select-dropdown-menu-item') ||   
                target.classList.contains('ant-select-dropdown-menu-item-selected') ||
                (target.nodeName==="SPAN" && target.innerText==='Month' ) ||
                (target.nodeName==="SPAN" && target.innerText==='Year' ) ||
                target.classList.contains('ant-fullcalendar-column-header') ||
                target.classList.contains('ant-fullcalendar-column-header-inner') )

            //紧急选择框
            let urgencyBox = (
                target.classList.contains('ant-fullcalendar-content') ||
                target.getAttribute('id')==='taskUrgency' ||
                target.classList.contains('taskUrgencyLi') ||
                target.classList.contains('normalBtn') ||
                target.classList.contains('urgencyBtn') ||
                target.classList.contains('emtremeUrgencyBtn') ||
                target.classList.contains('normal') ||
                target.classList.contains('urgency') ||
                target.classList.contains('emtremeUrgency') ||
                target.classList.contains('anticon-check') ||
                target.classList.contains('taskUrgencyIcon')  ||
                target.classList.contains('showUrgencyLevel') )

            //设置子任务的标签
            let aboutTags = (
                target.classList.contains('editableTagGroupWrap') || 
                target.classList.contains('goToAddTagIcon') || 
                target.classList.contains('ant-tag') ||
                target.classList.contains('setTagBox') ||
                target.classList.contains('tag-text')||
                target.classList.contains('anticon-tags-o') ||
                target.classList.contains('anticon-cross') ||
                target.classList.contains('setSubTaskTagInput'))

            //关于下拉列表菜单里面的移动或者复制项目的选择 项目名cover框
            let aboutChooseFileNameCover = (
                target.getAttribute('id')==='ShowFileNameCoverIndropDownContainer' ||
                target.classList.contains('searchFileNameInput') ||
                target.classList.contains('ShowFileNameWrap') ||
                target.classList.contains('no-star-File-wrap') ||
                target.classList.contains('all-no-star-Files') ||
                target.classList.contains('star-File-wrap') ||
                target.classList.contains('all-star-Files') ||
                target.classList.contains('star-File') ||
                target.classList.contains('checkFileNameIcon') ||
                target.classList.contains('no-star-File') ||
                target.classList.contains('divWrap') ||
                target.classList.contains('title'))

            //关于下拉列表菜单里面的移动或者复制项目的选择 列表名cover框 列表名
            let aboutChooseTaskItemNameCover = (
                target.getAttribute('id')==='CurrentTaskItemNameCoverWrap' ||
                target.classList.contains('CurrentTaskItemName') ||
                target.classList.contains('selectTaskItemNameICon') )

            //关于下拉列表菜单
            let aboutDropDownMenu = (
                    target.classList.contains('DeleteSubTaskOrDeleteTaskItemWrap') || 
                    target.classList.contains('tips') || 
                    target.classList.contains('confirmToDeleteSubTaskOrDeleteTaskItem') ||
                    target.classList.contains('MoveOrCopySubTaskWrap') ||
                    target.classList.contains('MoveOrCopySubTaskContent')||
                    target.classList.contains('MoveOrCopySubTaskList') ||
                    target.classList.contains('MoveOrCopySubTaskTitle') ||
                    target.classList.contains('ConfirmMoveOrCopySubTaskBtn') ||
                    target.classList.contains('selectFileTitleSpan') ||
                    target.classList.contains('FileTitleEm') ||
                    target.classList.contains('selectFileDownICon') ||
                    target.classList.contains('selectTaskItemTitleSpan') ||
                    target.classList.contains('TaskItemTitleEm') ||
                    target.classList.contains('selectTaskItemDownICon') ||
                    target.classList.contains('dropdown-container') || 
                    target.classList.contains('Add_TaskItem')  ||
                    target.classList.contains('anticon-left')  ||
                    target.classList.contains('dropdown_title')  ||
                    target.classList.contains('modifyDetailList')  ||
                    target.classList.contains('modifyItem')  ||
                    target.classList.contains('anticon-edit')  ||
                    target.classList.contains('anticon-plus')  ||
                    target.classList.contains('anticon-copy') ||
                    target.classList.contains('anticon-delete') ||
                    target.classList.contains('anticon-down-circle-o') ||
                    target.classList.contains('MOrAddListTaskItem') ||
                    target.classList.contains('createATaskItemText') ||
                    target.classList.contains('MTaskItemInput') ||
                    target.classList.contains('createATaskItemBtn') ||
                    target.classList.contains('saveModifyInputValueBtn') ||
                    aboutChooseFileNameCover ||
                    aboutChooseTaskItemNameCover)
            
            //-----------------------控制新建任务框的各种cover框-----------------
            if(target.classList.contains('task-creator-handler-wrap') ||
                target.classList.contains('task-creator-handler') ||
                target.classList.contains('AddSubTaskIcon')
            ){
                // 点击弹出新建框
                if(this._isMounted){
                    this.setState({
                        deadlineData:{
                            time:''
                        }
                    })
                }
            }else if(target.classList.contains('subTask-creator-wrap') ||
               target.classList.contains('createUser') ||
               target.classList.contains('confirmCreacteBtn-wrap') ||
               target.classList.contains('task-creator') ||
               target.classList.contains('detail-infos-priority-view') ||
               target.classList.contains('scenario-creators-wrap') || 
               target.classList.contains('UrgencyLevelWrap') ||
                // 日历
                CanlenderCondition ||   
                //日历 关闭 确定按钮
                target.classList.contains('clear') ||   
                target.classList.contains('confirm') ||
                // 紧急选择框
                urgencyBox
            ){
                if(!CanlenderCondition){//关闭日历
                    HideAllTaskItemCalenderAction('close');
                }
                if(!(target.classList.contains('showUrgencyLevel') ||
                target.classList.contains('normal') ||
                target.classList.contains('urgency') ||
                target.classList.contains('emtremeUrgency'))){
                    //关闭任务紧急情况选择框
                    HideChoiceUrgencyLevelAction('close');
                }
            }else if(target.classList.contains('task-content-input')){//输入任务内容
                //关闭日历
                HideAllTaskItemCalenderAction('close');
            }else if(target.classList.contains('date-wrap') ||
                     target.classList.contains('anticon-calendar') ||
                     target.classList.contains('date-text')
            ){//设置时间
            }else if((target.classList.contains('priority-container')||
                     target.classList.contains('icon-circle')) && 
                     (!target.classList.contains('showUrgencyLevel'))
            ){//设置紧急程度
                HideChoiceUrgencyLevelAction('close');
            }else if(aboutTags){//设置标签
                ////关闭任务紧急情况选择框
               HideChoiceUrgencyLevelAction('close');
            }else if(target.classList.contains('confirmCreacteBtn')){
                //创建子任务
            }else{
                HideChoiceUrgencyLevelAction('close');
                // 关闭 新建子任务框
                HideAllSubTaskCreatorsAction('close');
                //关闭日历
                HideAllTaskItemCalenderAction('close');
                if(this._isMounted){
                    this.setState({
                        deadlineData:{}
                    }) 
                }
            }
            //----------------------------控制下拉菜单--------------------------------
            if(!aboutDropDownMenu){
                //隐藏下拉菜单
                HideTaskItemDropDownContainerAction('close');
            }else{
                //下拉列表菜单里面的移动或者复制项目的选择 项目名cover框 隐藏
                if(!aboutChooseFileNameCover &&
                    !(target.classList.contains('selectFileTitleSpan') ||
                    target.classList.contains('FileTitleEm') ||
                    target.classList.contains('selectFileDownICon'))
                ){
                    ToHideShowFileNameCoverAction('close');
                }
                //下拉列表菜单里面的移动或者复制项目的选择 列表名cover框 隐藏
                if(!aboutChooseTaskItemNameCover &&
                    !(target.classList.contains('selectTaskItemTitleSpan') ||
                    target.classList.contains('TaskItemTitleEm') ||
                    target.classList.contains('selectTaskItemDownICon'))
                ){
                    ToHideShowCurrentTaskItemNameCoverAction('close')
                }
            }
            //----------------------------控制新建任务列表框--------------------------
            let aboutCreateTaskItem = (target.classList.contains('createWrap') ||
                !(target.classList.contains('createTaskItem') ||
                target.classList.contains('taskItemCreateIcon') ||
                target.classList.contains('taskItemCreateIconWrap') ||
                target.classList.contains('creator-form-wrap') ||
                target.classList.contains('stage-name') ||
                target.classList.contains('taskItemCreateIconWrap') ||
                target.classList.contains('taskItemCreator-btns') ||
                target.classList.contains('submit') ||
                target.classList.contains('cancel')))

            if(aboutCreateTaskItem ){
                //新建项目列表框 隐藏
                HideTaskItemCreatorAction('close');
            }
            if(target.classList.contains('anticon-search') ||
                target.classList.contains('searchProject') ){
                hideOrShowSearchBoxAction({isShow:true})
            }else{
                hideOrShowSearchBoxAction({isShow:false})
                if(document.getElementsByClassName('searchProject') &&
                   document.getElementsByClassName('searchProject')[0]
                ){
                    document.getElementsByClassName('searchProject')[0].value = '';
                }
            }
            if( !(target.classList.contains('ProjectTypeSelect') ||
                target.classList.contains('ant-spin-nested-loading') ||
                target.classList.contains('ant-spin-container') ||
                target.classList.contains('ant-list-item') ||
                target.classList.contains('ant-list-item-meta ProjectTypeItem') ||
                target.classList.contains('ant-list-item-meta-avatar') ||
                target.classList.contains('ant-list-item-meta-content')  ||
                target.classList.contains('anticon-folder-open')  ||
                target.classList.contains('ant-list-item-meta-title') ) && !target.classList.contains('extendBtn')){
                hideOrShowProjectTypeSelectAction({ProjectTypeSelectIsShow:false})
            }
        } 
    }
    GoToCreateSubTask=(id)=>{// 显示 新建子任务框
        let {
            SubTaskCreatorIsShowAction,
            HideTaskItemDropDownContainerAction,
            HideAllTaskItemCalenderAction
            } = this.props;
        SubTaskCreatorIsShowAction(id);
        HideTaskItemDropDownContainerAction('close');//隐藏下拉菜单
        //关闭日历
        HideAllTaskItemCalenderAction('close');
    }
    GoToShowDropDownContainer=(id)=>{// 显示下拉列表菜单
        let { TaskItemDropDownContainerShowAction } = this.props;
        TaskItemDropDownContainerShowAction(id);
    }
    GoToChoiceSubTaskDeadline=(id)=>{//显示选择被创建的子任务 的截止时间日历
        let { TaskItemCalenderIsShowAction } = this.props;
        TaskItemCalenderIsShowAction(id);
        //子任务编辑框失去焦点
        let SubTaskCreatorBox = document.getElementsByClassName('subTask-creator-wrap').item(0);
        if(SubTaskCreatorBox){
            let SubTaskContent = SubTaskCreatorBox.getElementsByClassName('task-content-input form-control').item(0);
            SubTaskContent.blur();
        } 
    }
    getDeadline=(id,time)=>{//拿到日历选中的时间
        if(this._isMounted){
            this.setState({
                deadlineData:{id,time}
            })  
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    render() { 
        let { deadlineData , isLoadingTaskItem} = this.state;
        let { state:{ taskItemInfo , getFileInfo , subTaskInfo } , location:{pathname} } = this.props;
        let fileId = Number(pathname.match(/\d+/g)[0]);
        taskItemInfo = taskItemInfo.filter(val=>val.fileId === fileId)
        //把项目文件数据按照待处理/已完成/进行中 排序
        taskItemInfo = taskItemInfo.sort(function(a,b){
            return a.index*100-b.index*100
        })
        let t;
        if(getFileInfo.length>0){
             t = <TaskItemCreator fileId={fileId} getFileInfo={getFileInfo}/>
        }
        return (
            <ul id="TasksWrap">
                {taskItemInfo.map(val=>{
                    return <li className="taskItem"  key={val.taskItemId}>
                                {val.IsChoiceDeadline ? <CanlenderMode {...{taskItemId:val.taskItemId,getDeadline:this.getDeadline}}/> : null}
                            
                                <TaskItem 
                                    deadline={val.taskItemId === deadlineData.id ? deadlineData.time : null}
                                    taskItemInfo={val} 
                                    GoToCreateSubTask={this.GoToCreateSubTask}
                                    GoToShowDropDownContainer={this.GoToShowDropDownContainer}
                                    GoToChoiceSubTaskDeadline={this.GoToChoiceSubTaskDeadline}
                                    subTaskInfo={subTaskInfo}
                                    isLoadingTaskItem={isLoadingTaskItem}
                                />
                           </li>
                })}
                {/* 新建任务列表 */}
                {t}
            </ul> 
        )
    }
}

const mapStateToProps = state => {
    return  {
        state
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Object.assign(taskActions,workActions),dispatch)
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Tasks));