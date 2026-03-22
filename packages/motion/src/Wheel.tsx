import './EmotionContainer.css';
import styled from '@emotion/styled';
const EmotionContainer = () => {
    return (

        <CircleWheelWrap className={'content_feeling'}>
            <div className={"edit_box"}>
                <button className="btn_input_wrap" class="editedClassFlag ? 'edited' : ''" type="button" @click.prevent.stop="openCloseEmotionMessagePopup('open')">
                <span className={"text"} v-text="emoTxt"></span>
                <i className={"btn_edit_text"}>
                </i>
                <span className={"blind"}>7</span>
            </button>
            <button type="button" className={"btn_delete"} @click="deleteInputText">
            <span className={"blind"}></span>
        </button>
            </div >
    <div className={'circle_wheel_wrap'} data-indicator="true">
        {/* <!-- CHPFMTASK-619 data속성 추가 data-indicator="true" --> */}
        <div className={'circle_wheel_inner new-color'} style={{ opacity: 0 }}>
            {/* <!-- CHPFMTASK-619 클래스 추가 'new-color'--> */}
            <div className={'circle_line no-drag'}>
                <svg
                    fill="none"
                    height="276"
                    viewBox="0 0 276 276"
                    width="276"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    fill-rule="evenodd"
                    <path
                        className={'wheel_1'}
                        clip-rule="evenodd"
                        d="M137.964 20C72.8141 20 20 72.8141 20 137.964C20 203.113 72.8141 255.927 137.964 255.927C203.113 255.927 255.927 203.113 255.927 137.964C255.927 72.8141 203.113 20 137.964 20ZMO 137.964C0 61.7684 61.7684 0 137.964 0C214.159 0 275.927 61.7684 275.927 137.964C275.927 214.159 214.159 275.927 137.964 275.927C61.7684 275.927 @ 214.159 0 137.964Z"
                    />
                    <circle
                        aria-label="기분이미지 선택 soso 쏘쏘한 날"
                        className={'dot_1'}
                        cx="252.549"
                        cy="196.111"
                        data-index="1"
                        r="2"
                        role="button"
                        transform="rotate(-63 252.549 196.111)"
                    />
                    <circle
                        aria-label="기분이미지 선택 아무 생각이 없다"
                        className={'dot_1'}
                        cx="229.011"
                        cy="228.51"
                        data-index="2"
                        r="2"
                        role="button"
                        transform="rotate(-45 229.011 228.51)"
                    />
                    <circle
                        aria-label="기분이미지 선택 영혼탈출"
                        className={'dot_1'}
                        cx="196.611"
                        cy="252.049"
                        data-index="3"
                        r="2"
                        role="button"
                        transform="rotate(-27 196.611 252.049)"
                    />
                    <circle
                        aria-label="기분이미지 선택 안 풀리는 하루"
                        className={'dot_1'}
                        cx="158.524"
                        cy="264.424"
                        data-index="4"
                        r="2"
                        role="button"
                        transform="rotate(-9 158.524 264.424)"
                    />
                    <circle
                        aria-label="기분이미지 선택 눈물이 또르르"
                        className={'dot_1'}
                        cx="118.476"
                        cy="264.424"
                        data-index="5"
                        r="2"
                        role="button"
                        transform="rotate(-171 118.476 264.424)"
                    />
                    <circle
                        aria-label="기분이미지 선택 혼자 있고싶은 오늘"
                        className={'dot_1'}
                        cx="80.3896"
                        cy="252.849"
                        data-index="6"
                        r="2"
                        role="button"
                        transform="rotate(-153 80.3896 252.049)"
                    />
                    <circle
                        aria-label="기분이미지 선택 우울하다 우울해"
                        className={'dot_1'}
                        cx="47.9902"
                        cy="228.509"
                        data-index="7"
                        r="2"
                        role="button"
                        transform="rotate(-135 47.9902 228.509)"
                    />
                    <circle
                        aria-label="71200X MEN TO 24"
                        className={'dot_1'}
                        cx="24.4512"
                        cy="196.111"
                        data-index="8"
                        r="2"
                        role="button"
                        transform="rotate(-117 24.4512 196.111)"
                    />
                    <circle
                        aria-label="기분이미지 선택 잠이 안오네"
                        className={'dot_1'}
                        cx="24.4512"
                        cy="196.111"
                        data-index="8"
                        r="2"
                        role="button"
                        transform="rotate(-117 24.4512 196.111)"
                    />
                    <circle
                        aria-label="기분이미지 선택 오구 힐링이 필요해"
                        className={'dot_1'}
                        cx="12.0766"
                        cy="158.024"
                        data-index="9"
                        r="2"
                        role="button"
                        transform="rotate(-99 12.0766 158.024)"
                    />
                    <circle
                        aria-label="기분이미지 선택 때려치고 싶은 날"
                        className={'dot_1'}
                        cx="12.0763"
                        cy="117.976"
                        data-index="10"
                        r="2"
                        role="button"
                        transform="rotate(-81 12.0763 117.976)"
                    />
                    <circle
                        aria-label="기분이미지 선택 나한테 다들 왜그래"
                        className={'dot_1'}
                        cx="24.4517"
                        cy="79.8892"
                        data-index="11"
                        r="2"
                        role="button"
                        transform="rotate(-63 24.4517 79.8892)"
                    />
                    <circle
                        aria-label="기분이미지 선택 홈 세상 짜증날때"
                        className={'dot_1'}
                        cx="47.9915"
                        cy="47.4902"
                        data-index="12"
                        r="2"
                        role="button"
                        transform="rotate(-45 47.9915 47.4902)"
                    />
                    <circle
                        aria-label="기분이미지 선택 왜 나한테만 그래"
                        className={'dot_1'}
                        cx="80.3892"
                        cy="23.9512"
                        data-index="13"
                        r="2"
                        role="button"
                        transform="rotate(-27 80.3892 23.9512)"
                    />
                    <circle
                        aria-label="기분이미지 선택 10년치스트레스"
                        className={'dot_1'}
                        cx="118.477"
                        cy="11.5758"
                        data-index="14"
                        r="2"
                        role="button"
                        transform="rotate(-9 118.477 11.5758)"
                    />
                    <circle
                        aria-label="기분이미지 선택 뭘해도 되는 날"
                        className={'dot_1'}
                        cx="158.523"
                        cy="11.5755"
                        data-index="15"
                        r="2"
                        role="button"
                        transform="rotate(-171 158.523 11.5755)"
                    />
                    <circle
                        aria-label="기분이미지 선택 오늘은 설레는 날!"
                        className={'dot_1'}
                        cx="196.611"
                        cy="23.951"
                        data-index="16"
                        r="2"
                        role="button"
                        transform="rotate(-153 196.611 23.951)"
                    />
                    <circle
                        aria-label="기분이미지 선택 케뱅아 생일 축하해"
                        className={'dot_1'}
                        cx="229.01"
                        cy="47.4901"
                        data-index="17"
                        r="2"
                        role="button"
                        transform="rotate(-135 229.01 47.4901)"
                    />
                    <circle
                        aria-label="기분이미지 선택 빵터졌네 ㅋㅋㅋ"
                        className={'dot_1'}
                        cx="252.549"
                        cy="79.8891"
                        data-index="18"
                        r="2"
                        role="button"
                        transform="rotate(-117 252.549 79.8891)"
                    />
                    <circle
                        aria-label="기분이미지 선택 하루종일 행복한 날"
                        className={'dot_1'}
                        cx="264.925"
                        cy="117.976"
                        data-index="19"
                        r="2"
                        role="button"
                        transform="rotate(-99 264.925 117.976)"
                    />
                    <circle
                        aria-label="기분이미지 선택 담담한 기분"
                        className={'dot_1'}
                        cx="264.925"
                        cy="158.023"
                        data-index="0"
                        r="2"
                        role="button"
                        transform="rotate(-81 264.925 158.023)"
                    />
                </svg>
                {/* <!-- //CHPFMTASK-619 svg --> */}
            </div>
            <div className={'preloader-wrap no-drag'} />
            <div className={'circle'}>
                <div className={'wheel'} />
            </div>
        </div>
        {/* <!-- s: 43213/툴팁 추가 --> */}
        <div
            className={'tooltip-focus-group ui-tooltip tooltip-handle'}
            v-show="isTooltipShow || isPboxEvntTooltipShow"
        >
            <div className={'tooltip-area align-center'}>
                <div className={'tooltip-box'}>
                    <div className={'tooltip-content'}>
                        <p className={'txt'}>{/* {{tooltipTxt }} */}</p>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- e: 43213 / 툴팁추가 --> */}
    </div>
            </CircleWheelWrap >
        </>
    );
}

export default EmotionContainer;
const CircleWheelWrap = styled.div`
    position: relative;
    width: 100%;
    height: 304px;
`;
