<template>
  <div class="mainDiv">
    <div class="topDiv">
      <el-input @blur="searchBlur()" @keyup.enter.native="searh" prefix-icon="el-icon-search" placeholder="请输入内容" v-model="inputSearch" class="input-with-select"></el-input>
    </div>
    <div class="plusButton">
      <el-button v-on:click="openDialog" icon="el-icon-plus" ></el-button>
    </div>
    <div class="closeButton">
      <el-button v-on:click="closeWin" icon="el-icon-close" ></el-button>
    </div>
    <el-tooltip content="不要点我噢" placement="right" effect="light">
      <div class="exhale-icon">
        <img v-on:click="showPage" width="40px" height="40px" src="static/exhale256.png">
      </div>
    </el-tooltip>
    <div class="inner">
      <div class="content">
        <el-table
            v-loading = "pictLoading"
            element-loading-background = "rgba(0, 0, 0, 0.5)"
            element-loading-text = "数据正在加载中"
            element-loading-spinner = "el-icon-loading"
            @row-dblclick="dataCallBack"
            :data="tableData"
            stripe
            max-height="700"
            :row-style="{height:'69px'}"
            :highlight-current-row="true"
            :show-header="false"
            style="width: 100%">
          <el-table-column
              v-if="false"
              prop="_id"
              label="ID">
          </el-table-column>
          <el-table-column type="String" label="内容" prop="content" >
            <template slot-scope="scope">
              <p v-html='scope.row.content'></p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="down" v-on:click="showAll">
        <i class="el-icon-caret-bottom"></i>
      </div>
    </div>
    <el-dialog
        :close-on-click-modal="false"
        :before-close="handleClose"
        :visible.sync="dialogVisible"
        width="75%">
      <el-input
          resize="none"
          type="textarea"
          :autosize="{ minRows: 10,maxRows:20}"
          v-model="dialogValue">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button v-on:click="saveData" type="primary" >Save</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

import {app} from "electron";

const { ipcRenderer,shell, remote } = require('electron');

export default {
  name: "main",
  data() {
    return {
      pictLoading: false,
      dialogVisible: false,
      dialogValue: '',
      dialogId: 0,
      inputSearch: '',
      tableData: []
    }
  },

  created() {
    const res = new Array();  //空数组
    //查询前十条数据
    this.$db.find({}).sort({createDate : -1 }).limit(10).exec(function (err, docs) {
      docs.forEach(function (el) {
        let resContent = el.content;
        if(el.content.length > 150){
          resContent = el.content.substr(0,150) + "......"
        }
        res.push({
          _id : el._id,
          content : resContent,
          createDate : el.createDate
        })
      })
    });
    this.tableData = res
  },

  methods:{

    showPage(){
      shell.openExternal("https://ddddddddd.top")
    },

    showAll(){
      this.pictLoading = true
      const res = new Array();  //空数组
      //查询前十条数据
      this.$db.find({}).sort({createDate : -1 }).exec(function (err, docs) {
        docs.forEach(function (el) {
          let resContent = el.content;
          if(el.content.length > 150){
            resContent = el.content.substr(0,150) + "......"
          }
          res.push({
            _id : el._id,
            content : resContent,
            createDate : el.createDate
          })
        })
      });
      this.tableData = res
      this.pictLoading = false
    },

    openWarning() {
      this.$message({
        message: '不能为空噢',
        type: 'warning'
      });
    },

    getAll(t){
      const res = new Array();  //空数组
      //查询前十条数据
      this.$db.find({}).sort({createDate : -1 }).limit(10).exec(function (err, docs) {
        docs.forEach(function (el) {
          let resContent = el.content;
          if(el.content.length > 150){
            resContent = el.content.substr(0,150) + "......"
          }
          res.push({
            _id : el._id,
            content : resContent,
            createDate : el.createDate
          })
        })
      });
      t.tableData = res
    },

    saveData(){
      if(this.dialogValue === ''){
        this.openWarning()
        return
      }
      if(this.dialogId === 0){
        //新增
        const doc = {
          content: this.dialogValue
          , createDate: new Date().getTime()
        };
        this.$db.insert(doc);
      }else {
        //修改
        this.$db.update({ _id: this.dialogId }, { $set: { content: this.dialogValue} },{},function (err, numReplaced) {
        });
      }
      this.dialogVisible = false
      this.dialogValue = ''
      this.dialogId = 0
      if(this.inputSearch === ''){
        //查询前十条数据
        this.getAll(this)
      }else {
        this.searh()
      }
    },

    handleClose(done) {
      done();
      this.dialogValue = ''
      this.dialogId = 0
    },

    dataCallBack(row, column, event){
      const t =this
      this.$db.findOne({ _id: row._id }, function (err, doc) {
        t.dialogValue = doc.content
        t.dialogId = doc._id
      });
      // this.dialogValue = row.content
      this.dialogVisible = true
    },

    searchBlur(){
      if(this.inputSearch === ''){
        //查询前十条数据
        this.getAll(this)
      }
    },

    searh(){
      if(this.inputSearch === ''){
        //查询前十条数据
        this.getAll(this)
        return
      }
      const res = new Array();  //空数组
      const reg = new RegExp(this.inputSearch,'i');
      const t = this;
      this.$db.find({content : reg }).exec(function (err, docs) {
        docs.forEach(function (el) {
          let resContent = el.content;
          let index = resContent.indexOf(t.inputSearch)
          let start = 0
          let end
          if(index > 75){
            start = index - 75
          }
          if(index + 75 > resContent.length){
            end = resContent.length
          }else {
            end = index + 75
          }
          if(el.content.length > 150){
            resContent = el.content.substr(start,end) + "......"
          }
          let str = "<span style='background-color: darkorange;'>" + t.inputSearch + "</span>"
          resContent = resContent.replace(t.inputSearch,str)
          res.push({
            _id : el._id,
            content : resContent,
            createDate : el.createDate
          })
        })
      });
      t.tableData = res
    },

    closeWin(){
      ipcRenderer.send("close");
    },

    openDialog(){
      this.dialogVisible = true
    }

  }

}
</script>

<style>
  .exhale-icon{
    cursor: pointer;
    -webkit-app-region: no-drag;
    left: 10px;
    top: 10px;
    position: absolute;
    width: 50px;
    height: 50px;
  }

  .topDiv{
    display: inline-block;
    width: 50%;
    position: relative;
    top: 10px;
    left: 25%;
  }
  .plusButton{
    display: inline-block;
    width: 50px;
    position: absolute;
    top: 10px;
    right: 21%;
  }

  .closeButton{
    display: inline-block;
    width: 50px;
    position: absolute;
    top: 10px;
    right: 1%;
  }
  .down{
    position: absolute;
    top: 94%;
    left: 50%;
    display: inline-block;
    height: 100px;
    width: 100px;
    font-size: 25px;
  }
  .content{
    cursor: pointer;
    position:relative;
    top: 3%;
    left: 4%;
    width: 93%;
    height: 90%;
  }

  .inner{
    -webkit-app-region: no-drag;
    border-radius: 5px;
    position: relative;
    top: 20px;
    margin: 0 auto;
    width: 90%;
    height: 85%;
    background-color: #feffff;
  }

  .mainDiv{
    width: 100%;
    height: 100%;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    /* width: 0;宽度为0隐藏 */
    width: 0px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 2px;
    height: 50px;
    background: #eee;
  }
  .el-table__body-wrapper::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.4);
  }
</style>