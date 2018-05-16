package org.jason.framework.filter;

import java.util.Enumeration;

import org.apache.log4j.Logger;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;

public class JasonInterceptor implements Interceptor {
	private static final Logger log = Logger.getLogger(JasonInterceptor.class);

	@Override
	public void intercept(Invocation inv) {
		// TODO Auto-generated method stub
		Controller controller = inv.getController();
		String params = "";
		Enumeration<String> en = controller.getParaNames();
		while (en.hasMoreElements()) {
			String key = en.nextElement();
			params = params + key + ":" + controller.getPara(key) + ", ";
		}

		if (params.length() > 0) {
			params = "(" + params + ")";
		}
		if (params.endsWith(", )")) {
			int i = params.lastIndexOf(", )");
			params = params.substring(0,i)+")";
		}
		log.info("请求方法:" + controller.getClass().getName() +"."+ inv.getMethodName()+"() 参数:"+params);
		inv.invoke();
	}

}
