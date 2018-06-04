import React, { Component } from 'react';
import { Icon } from 'antd';
import DropDown from './dropdown/dropdown';
import SubTask from './subTasks';
import CheckedSubTasks from './checkedSubTasks';
import SubTaskCreator from './subTaskCreator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/**
 * 在点击进入文件夹：
 *      进入的时候请求查找，找到就直接渲染，找不到就创建    
 *      删除的时候先找到项目文件删除   然后根据项目文件loginName fileId 对应的项目列表 Id  对象的子项目  去进行删除
 *      
 */

import './tasks.css';
/** 
 任务列表 taskItem
    loginName:String,用户的登录名
    fileId: Number,项目文件id
    taskItemId: Number,任务列表id
    taskItemName: String,任务列表名
    subTaskCount: Number子任务数量
 */
/** 
 子任务 subTask
    loginName:String,用户的登录名
    fileId: Number,项目文件id
    taskItemId: Number,任务列表id
    subTaskId: Number,子任务列表id
    subTaskName: String,任务列表名
    subTaskDeadline:String,任务截止时间
    isUrgency:String,紧急程度：普通normal  紧急urgency  非常紧急emtreme urgency
    tag:String,标签

 */
class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasTaskList:0,//子任务
            taskItemName:[]
         }
    }
    render() { 
        let { hasTaskList } = this.state;

        let { state } = this.props;
        console.log(this.props)
        return (
            <ul id="TasksWrap">
                {state.taskItemInfo.map(val=>{
                    return <li className="taskItem" key={val.taskItemId}>
                        {/* 下拉编辑框 */}
                        <DropDown/>
                        {/*  */}
                        <header className="taskItem-head">
                            <h4>
                                <span className="task-title">{val.taskItemName}</span>
                                <span className="task-count">{ hasTaskList ? '.'+ hasTaskList : null }</span>
                            </h4>
                            <Icon type="down-circle-o" size="large"/>
                        </header>
                        <div className="subTasksContent dls-thin-scroll">
                            {/* 没有被选中的任务 */}
                            {/* <SubTask/> */}
    
                            {/* 被选中的任务 */}
                            {/* <CheckedSubTasks/> */}
    
                            {/* 新建任务编辑框 */}
                            <SubTaskCreator/>
                            <div className="invisible-wrapper"></div>
                        </div>
    
                        {/* 点击添加任务 */}
                        <div className="task-creator-handler-wrap">
                            <a className="task-creator-handler link-add-handler">
                                <Icon type="plus-circle" style={{ fontSize: 15, color: '#3da8f5' , marginRight:'10px'}}/>
                                添加任务
                            </a>
                        </div> 
                    </li>
                })}
                {/* 新建任务列表 */}
                <li className="taskItem createWrap">
                    <div className="createTaskItem">
                        <a>
                            <Icon type="plus" />
                            新建任务列表
                        </a>
                    </div>
                    <div className="creator-form-wrap">
                        <input type="text" placeholder="新建任务列表..." className="stage-name"/>
                        <div className="btns">  
                            <a className="btn submit" >保存</a> 
                            <a className="btn cancel">取消</a>
                        </div>
                    </div>
                </li>
            </ul> 
        )
    }
}
 //要修改的数据
 const mapStateToProps = state => {
    return  {
        state
    }
  }
 
export default withRouter(connect(mapStateToProps,null)(Tasks));