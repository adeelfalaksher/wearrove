import {$,$$,day,plusDay} from '../lib/ui.mjs';
import {loanDates} from '/rules.mjs';

export function mount(){
  const looks={
    dress:{image:'dress.png',name:'Burgundy satin dress',detail:'A wedding, a dinner, another occasion.'},
    jacket:{image:'jacket.png',name:'Navy tailored blazer',detail:'For the interview or the evening after.'},
    blouse:{image:'blouse.png',name:'Ivory pleated blouse',detail:'Something different, already in a friend’s wardrobe.'}
  };
  $$('[data-look]').forEach(button=>button.addEventListener('click',()=>{
    const look=looks[button.dataset.look];if(!look)return;
    $('#hero-piece').src='/assets/'+look.image;$('#hero-piece').alt=look.name;
    $('#look-name').textContent=look.name;$('#look-detail').textContent=look.detail;
    $$('[data-look]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  const from=$('#plan-from'),to=$('#plan-to');
  if(from&&to){
    from.min=day();to.min=day();from.value=day();to.value=plusDay(day(),2);
    $('#plan-dates').addEventListener('submit',event=>{
      event.preventDefault();if(!event.currentTarget.reportValidity())return;
      const error=$('#plan-error');error.hidden=true;
      try{const dates=loanDates({start_date:from.value,end_date:to.value});location.href='/wardrobes?from='+encodeURIComponent(dates.start_date)+'&to='+encodeURIComponent(dates.end_date);}
      catch(problem){error.textContent=problem.message;error.hidden=false;}
    });
    to.addEventListener('input',()=>to.setCustomValidity(''));
    from.addEventListener('input',()=>to.setCustomValidity(''));
  }
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;observer.unobserve(entry.target);
      entry.target.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});
    }),{threshold:.1});
    $$('[data-reveal]').forEach(el=>observer.observe(el));
  }
}
