import './Popup.css'


function Chart(props){
    console.log(props)
    const { onClosePopup, onConfirmAddNode } = props
    //关闭弹窗
    const closePopup = (e) => {
        onClosePopup(e)
    }
    //添加子节点
    const confirmAddNode = (e) => {
        onConfirmAddNode(e)
    }
    return (
        <div className='popup'>
            <div className='popup-bg' onClick={closePopup}></div>
            <div className='popup-content' >
                <div className='popup-content-chart'>
                    <div className='chart-title'>这是一个弹窗</div>
                    <div className='chart-text'>你确定要添加一个子节点吗？请慎重！！！！！</div>
                    <div className='chart-but-div'>
                        <div className='chart-but-confirm chart-but' onClick={confirmAddNode}>确认</div>
                        <div className='chart-but-cancel chart-but' onClick={closePopup}>取消</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chart